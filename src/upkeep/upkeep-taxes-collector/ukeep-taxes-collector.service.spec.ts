import { Test, TestingModule } from '@nestjs/testing';

import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { ResourcesModule } from '../../resources/resources.module';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import { TroopsService } from '../../troops/troops.service';
import { TaxableProfile, TaxAmount } from '../upkeep.interfaces';
import { ResourcesService } from '../../resources/resources.service';
import { BuildingsService } from '../../buildings/buildings.service';

describe('UkeepTaxesCollectorService', () => {
  let upkeepTaxesCollectorService: UpkeepTaxesCollectorService;
  let troopsService: TroopsService;
  let resourceService: ResourcesService;
  let buildingService: BuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ResourcesModule,
        TroopsModule,
        BuildingsModule,
      ],
      providers: [UpkeepTaxesCollectorService],
    }).compile();

    upkeepTaxesCollectorService = module.get<UpkeepTaxesCollectorService>(
      UpkeepTaxesCollectorService,
    );
    troopsService = module.get<TroopsService>(TroopsService);
    resourceService = module.get<ResourcesService>(ResourcesService);
    buildingService = module.get<BuildingsService>(BuildingsService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(upkeepTaxesCollectorService).toBeDefined();
  });

  it('missing percentage', () => {
    expect(upkeepTaxesCollectorService.missingPercentage(100, 25)).toEqual(75);
    expect(upkeepTaxesCollectorService.missingPercentage(100, 50)).toEqual(50);
    expect(upkeepTaxesCollectorService.missingPercentage(100, 75)).toEqual(25);
    expect(upkeepTaxesCollectorService.missingPercentage(100, 90)).toEqual(10);
    expect(upkeepTaxesCollectorService.missingPercentage(100, 100)).toEqual(0);
  });

  describe('Tax collection', () => {
    it('has enough resources to pay upkeep taxes', async () => {
      const taxeProfile: TaxableProfile = {
        memberDiscordId: 'A',
        troops: {
          memberDiscordId: 'A',
          gatherers: 0,
          scavengers: 0,
          guards: 10,
          lightInfantry: 10,
        },
        buildings: {
          memberDiscordId: 'B',
          houses: 5,
          farms: 1,
          landfills: 1,
          pitTrap: 5,
          barraks: 1,
        },
      };
      const troopCost: TaxAmount = {
        food: 10,
        buildingMaterials: 0,
        gold: 10,
      };
      const buildingsCost: TaxAmount = {
        food: 0,
        buildingMaterials: 10,
        gold: 0,
      };

      const resources = await resourceService.getResourcesForMember('A');
      resources.food = 100;
      resources.gold = 100;
      resources.buildingMaterials = 100;
      await resources.save();

      const result = await upkeepTaxesCollectorService.collect(
        taxeProfile,
        troopCost,
        buildingsCost,
      );

      expect(result.success).toEqual(true);
      expect(result.paid).toMatchObject({
        food: 10,
        buildingMaterials: 10,
        gold: 10,
      });

      const taxedResources = await resourceService.getResourcesForMember('A');
      expect(taxedResources.food).toEqual(90);
      expect(taxedResources.buildingMaterials).toEqual(90);
      expect(taxedResources.gold).toEqual(90);
    });

    it('missing 50% of the food to pay for guards and light infantry', async () => {
      const taxeProfile: TaxableProfile = {
        memberDiscordId: 'A',
        troops: {
          memberDiscordId: 'A',
          gatherers: 0,
          scavengers: 0,
          guards: 10,
          lightInfantry: 10,
        },
        buildings: {
          memberDiscordId: 'B',
          houses: 5,
          farms: 1,
          landfills: 1,
          pitTrap: 5,
          barraks: 1,
        },
      };
      const troopCost: TaxAmount = {
        food: 100,
        buildingMaterials: 0,
        gold: 10,
      };
      const buildingsCost: TaxAmount = {
        food: 0,
        buildingMaterials: 10,
        gold: 0,
      };

      const resources = await resourceService.getResourcesForMember('A');
      resources.food = 50;
      resources.gold = 100;
      resources.buildingMaterials = 100;
      await resources.save();

      const troops = await troopsService.getMemberTroops('A');
      troops.guards = 10;
      troops.lightInfantry = 10;
      await troops.save();

      const result = await upkeepTaxesCollectorService.collect(
        taxeProfile,
        troopCost,
        buildingsCost,
      );

      expect(result.success).toEqual(false);
      expect(result.casualties.troops.guards).toEqual(5);
      expect(result.casualties.troops.lightInfantry).toEqual(5);

      const taxedTroops = await troopsService.getMemberTroops('A');
      expect(taxedTroops.guards).toEqual(5);
      expect(taxedTroops.lightInfantry).toEqual(5);

      const taxedResources = await resourceService.getResourcesForMember('A');
      expect(taxedResources.food).toEqual(0);
    });

    it('missing 25% of gold to pay for light infantry', async () => {
      const taxeProfile: TaxableProfile = {
        memberDiscordId: 'A',
        troops: {
          memberDiscordId: 'A',
          gatherers: 0,
          scavengers: 0,
          guards: 10,
          lightInfantry: 10,
        },
        buildings: {
          memberDiscordId: 'B',
          houses: 5,
          farms: 1,
          landfills: 1,
          pitTrap: 5,
          barraks: 1,
        },
      };
      const troopCost: TaxAmount = {
        food: 10,
        buildingMaterials: 0,
        gold: 100,
      };
      const buildingsCost: TaxAmount = {
        food: 0,
        buildingMaterials: 10,
        gold: 0,
      };

      const resources = await resourceService.getResourcesForMember('A');
      resources.food = 100;
      resources.gold = 25;
      resources.buildingMaterials = 100;
      await resources.save();

      const troops = await troopsService.getMemberTroops('A');
      troops.guards = 10;
      troops.lightInfantry = 10;

      await troops.save();
      const result = await upkeepTaxesCollectorService.collect(
        taxeProfile,
        troopCost,
        buildingsCost,
      );

      expect(result.success).toEqual(false);
      expect(result.casualties.troops.lightInfantry).toEqual(8);

      const taxedTroops = await troopsService.getMemberTroops('A');
      expect(taxedTroops.lightInfantry).toEqual(2);

      const taxedResources = await resourceService.getResourcesForMember('A');
      expect(taxedResources.gold).toEqual(0);
    });

    it('missing 10% building materials to pay for barraks', async () => {
      const taxeProfile: TaxableProfile = {
        memberDiscordId: 'A',
        troops: {
          memberDiscordId: 'A',
          gatherers: 0,
          scavengers: 0,
          guards: 10,
          lightInfantry: 10,
        },
        buildings: {
          memberDiscordId: 'B',
          houses: 5,
          farms: 1,
          landfills: 1,
          pitTrap: 5,
          barraks: 1,
        },
      };
      const troopCost: TaxAmount = {
        food: 0,
        buildingMaterials: 0,
        gold: 0,
      };
      const buildingsCost: TaxAmount = {
        food: 0,
        buildingMaterials: 100,
        gold: 0,
      };

      const resources = await resourceService.getResourcesForMember('A');
      resources.buildingMaterials = 99;
      await resources.save();

      const buildings = await buildingService.getBuildingsForMember('A');
      buildings.barraks = 1;
      await buildings.save();

      const result = await upkeepTaxesCollectorService.collect(
        taxeProfile,
        troopCost,
        buildingsCost,
      );

      expect(result.success).toEqual(false);
      expect(result.casualties.buildings.barraks).toEqual(1);

      const taxedBuildings = await buildingService.getBuildingsForMember('A');
      expect(taxedBuildings.barraks).toEqual(0);

      const taxedResources = await resourceService.getResourcesForMember('A');
      expect(taxedResources.buildingMaterials).toEqual(0);
    });
  });
});
