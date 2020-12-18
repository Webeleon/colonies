import { Test, TestingModule } from '@nestjs/testing';
import * as _ from 'lodash';

import { UpkeepTaxesService } from './upkeep-taxes.service';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';

describe('UpkeepTaxesService', () => {
  let service: UpkeepTaxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('upkeep taxe service'),
        TroopsModule,
        BuildingsModule,
      ],
      providers: [UpkeepTaxesService],
    }).compile();

    service = module.get<UpkeepTaxesService>(UpkeepTaxesService);
  });

  afterEach(async () => {
    await closeInMongodConnection('upkeep taxe service');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const troops1 = {
    memberDiscordId: '1',
    gatherers: 10,
    scavengers: 2,
    guards: 0,
    lightInfantry: 1,
  };
  const troops2 = {
    memberDiscordId: '2',
    gatherers: 10,
    scavengers: 2,
    guards: 0,
    lightInfantry: 1,
  };
  const buildings1 = {
    memberDiscordId: '1',
    houses: 3,
    farms: 1,
    landfills: 1,
    pitTrap: 1,
    barraks: 1,
  };
  const buildings2 = {
    memberDiscordId: '2',
    houses: 2,
    farms: 1,
    landfills: 0,
    pitTrap: 10,
    barraks: 1,
  };

  it('troops > buildings', () => {
    const troops = [troops1, troops2];

    const buildings = [buildings1];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(2);
    expect(_.find(merged, { memberDiscordId: '1' })).toMatchObject({
      memberDiscordId: '1',
      troops: troops1,
      buildings: buildings1,
    });
    expect(_.find(merged, { memberDiscordId: '2' })).toMatchObject({
      memberDiscordId: '2',
      troops: troops2,
    });
  });

  it('troops < buildings', () => {
    const troops = [troops1];

    const buildings = [buildings1, buildings2];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(2);
    expect(_.find(merged, { memberDiscordId: '1' })).toMatchObject({
      memberDiscordId: '1',
      troops: troops1,
      buildings: buildings1,
    });
    expect(_.find(merged, { memberDiscordId: '2' })).toMatchObject({
      memberDiscordId: '2',
      buildings: buildings2,
    });
  });

  it('troops === buildings', () => {
    const troops = [troops1];

    const buildings = [buildings1];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(1);
    expect(merged[0]).toMatchObject({
      memberDiscordId: '1',
      troops: troops1,
      buildings: buildings1,
    });
  });

  it('troops !== buildings', () => {
    const troops = [troops1];

    const buildings = [buildings2];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(2);
    expect(_.find(merged, { memberDiscordId: '1' })).toMatchObject({
      memberDiscordId: '1',
      troops: troops1,
    });
    expect(_.find(merged, { memberDiscordId: '2' })).toMatchObject({
      memberDiscordId: '2',
      buildings: buildings2,
    });
  });

  it('troops and not buildings', () => {
    const troops = [troops1, troops2];

    const buildings = [];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(2);
    expect(_.find(merged, { memberDiscordId: '1' })).toMatchObject({
      memberDiscordId: '1',
      troops: troops1,
    });
    expect(_.find(merged, { memberDiscordId: '2' })).toMatchObject({
      memberDiscordId: '2',
      troops: troops2,
    });
  });

  it('buildings and no troops', () => {
    const troops = [];

    const buildings = [buildings1, buildings2];

    const merged = service.mergeTroopsAndBuildings(troops, buildings);
    expect(merged.length).toEqual(2);
    expect(_.find(merged, { memberDiscordId: '1' })).toMatchObject({
      memberDiscordId: '1',
      buildings: {
        memberDiscordId: '1',
        houses: 3,
        farms: 1,
        landfills: 1,
        pitTrap: 1,
        barraks: 1,
      },
    });
    expect(_.find(merged, { memberDiscordId: '2' })).toMatchObject({
      memberDiscordId: '2',
      buildings: {
        memberDiscordId: '2',
        houses: 2,
        farms: 1,
        landfills: 0,
        pitTrap: 10,
        barraks: 1,
      },
    });
  });

  it('no troops and no buildings', () => {
    const merged = service.mergeTroopsAndBuildings([], []);
    expect(merged).toEqual([]);
  });
});
