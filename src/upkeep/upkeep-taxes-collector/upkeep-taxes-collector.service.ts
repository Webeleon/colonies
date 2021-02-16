import { Injectable, Logger } from '@nestjs/common';
import { ResourcesService } from '../../resources/resources.service';
import {
  TaxableProfile,
  TaxAmount,
  UpkeepTaxeCollectionResult,
} from '../upkeep.interfaces';
import { TroopsService } from '../../troops/troops.service';
import { BuildingsService } from '../../buildings/buildings.service';
import { TROOP_TYPE } from '../../troops/troops.interface';

@Injectable()
export class UpkeepTaxesCollectorService {
  constructor(
    private readonly resourceService: ResourcesService,
    private readonly troopsService: TroopsService,
    private readonly buildingsService: BuildingsService,
  ) {}

  async collect(
    profile: TaxableProfile,
    troopsCost: TaxAmount,
    buildingsCost: TaxAmount,
  ): Promise<UpkeepTaxeCollectionResult> {
    Logger.debug(troopsCost, 'troop cost');
    Logger.debug(buildingsCost, 'building cost');
    const resources = await this.resourceService.getResourcesForMember(
      profile.memberDiscordId,
    );
    Logger.debug(resources, 'member resource');
    const result: UpkeepTaxeCollectionResult = {
      success: true,
      colonieTaxes: {
        food: troopsCost.food + buildingsCost.food,
        buildingMaterials:
          troopsCost.buildingMaterials + buildingsCost.buildingMaterials,
        gold: troopsCost.gold + buildingsCost.gold,
      },
      paid: {
        food: 0,
        buildingMaterials: 0,
        gold: 0,
      },
      casualties: {
        buildings: {
          barraks: 0,
        },
        troops: {
          guards: 0,
          lightInfantry: 0,
        },
      },
    };

    // troops
    if (troopsCost.food > 0) {
      if (troopsCost.food <= resources.food) {
        await this.resourceService.consumeFood(
          profile.memberDiscordId,
          troopsCost.food,
        );
        result.paid.food += troopsCost.food;
      } else {
        result.success = false;
        await this.resourceService.consumeFood(
          profile.memberDiscordId,
          resources.food,
        );
        result.paid.food += resources.food;
        const missingPercentage = this.missingPercentage(
          troopsCost.food,
          resources.food,
        );
        const guardsToDismiss = Math.floor(
          profile.troops.guards * (missingPercentage / 100),
        );
        const lightInfantryToDismiss = Math.floor(
          profile.troops.lightInfantry * (missingPercentage / 100),
        );

        result.casualties.troops.guards = guardsToDismiss;
        await this.troopsService.dismissTroop(
          profile.memberDiscordId,
          TROOP_TYPE.GUARD,
          guardsToDismiss,
        );
        result.casualties.troops.lightInfantry = lightInfantryToDismiss;
        await this.troopsService.dismissTroop(
          profile.memberDiscordId,
          TROOP_TYPE.LIGHT_INFANTRY,
          lightInfantryToDismiss,
        );
      }
    }

    if (troopsCost.gold > 0) {
      if (troopsCost.gold <= resources.gold) {
        await this.resourceService.consumeGold(
          profile.memberDiscordId,
          troopsCost.gold,
        );
        result.paid.gold += troopsCost.gold;
      } else {
        result.success = false;
        await this.resourceService.consumeGold(
          profile.memberDiscordId,
          resources.gold,
        );
        result.paid.gold += resources.gold;
        const missingPercentage = this.missingPercentage(
          troopsCost.gold,
          resources.gold,
        );
        const lightInfantryToDismiss = Math.round(
          profile.troops.lightInfantry * (missingPercentage / 100),
        );
        await this.troopsService.dismissTroop(
          profile.memberDiscordId,
          TROOP_TYPE.LIGHT_INFANTRY,
          lightInfantryToDismiss,
        );
        result.casualties.troops.lightInfantry = lightInfantryToDismiss;
      }
    }

    // buildings
    if (buildingsCost.buildingMaterials > 0) {
      if (buildingsCost.buildingMaterials <= resources.buildingMaterials) {
        await this.resourceService.consumeBuildingMaterials(
          profile.memberDiscordId,
          buildingsCost.buildingMaterials,
        );
        result.paid.buildingMaterials += buildingsCost.buildingMaterials;
      } else {
        result.success = false;
        result.casualties.buildings.barraks = 1;
        await this.resourceService.consumeBuildingMaterials(
          profile.memberDiscordId,
          resources.buildingMaterials,
        );
        result.paid.buildingMaterials += resources.buildingMaterials;
        await this.buildingsService.demolishBarrak(profile.memberDiscordId);
      }
    }

    return result;
  }

  missingPercentage(toPay: number, available: number): number {
    return Math.floor(((toPay - available) / toPay) * 100);
  }
}
