import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

import { TroopsService } from './troops.service';
import { rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';
import { TroopsSchema } from './troops.model';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TroopsDocument } from './troops.interface';
import { Model } from 'mongoose';

describe('TroopsService', () => {
  let service: TroopsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Troops', schema: TroopsSchema }]),
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [TroopsService],
    }).compile();

    service = module.get<TroopsService>(TroopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get upkeepable troops', () => {
    beforeEach(async () => {
      const troopsModel = module.get<Model<TroopsDocument>>('TroopsModel');
      await troopsModel.deleteMany({});
    });

    it('fetch if colonie have some guards', async () => {
      const PLAYER_A = 'colonie with only guards';
      const troops = await service.getMemberTroops(PLAYER_A);
      troops.guards = 1;
      await troops.save();

      const ukeepableProfiles = await service.getAllUpkeepableTroopsProfiles();
      expect(ukeepableProfiles.length).toEqual(1);
      const playerAProfile = _.find(ukeepableProfiles, {
        memberDiscordId: PLAYER_A,
      });
      expect(playerAProfile.guards).toEqual(1);
      expect(playerAProfile.lightInfantry).toEqual(0);
    });

    it('fetch if colonie have some light infantry', async () => {
      const PLAYER_B = 'colonie with only light infantry';
      const troops = await service.getMemberTroops(PLAYER_B);
      troops.guards = 1;
      await troops.save();

      const ukeepableProfiles = await service.getAllUpkeepableTroopsProfiles();
      expect(ukeepableProfiles.length).toEqual(1);
      const playerBProfile = _.find(ukeepableProfiles, {
        memberDiscordId: PLAYER_B,
      });
      expect(playerBProfile.guards).toEqual(1);
      expect(playerBProfile.lightInfantry).toEqual(0);
    });

    it('fetch if colonie have guards and infantry', async () => {
      const PLAYER_C = 'colonie with guards and light infantry';
      const troops = await service.getMemberTroops(PLAYER_C);
      troops.guards = 1;
      troops.lightInfantry = 1;
      await troops.save();

      const ukeepableProfiles = await service.getAllUpkeepableTroopsProfiles();
      expect(ukeepableProfiles.length).toEqual(1);
      const playerCProfile = _.find(ukeepableProfiles, {
        memberDiscordId: PLAYER_C,
      });
      expect(playerCProfile.guards).toEqual(1);
      expect(playerCProfile.lightInfantry).toEqual(0);
    });
  });
});
