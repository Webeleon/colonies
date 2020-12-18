import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { PvpShieldService } from './pvp-shield.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { PvpShieldSchema } from './pvp-shield.model';
import { PvpShieldDocument } from './pvp-shield.interfaces';
import { SHIELD_DURATION_IN_HOURS } from '../../game/pvp.constants';

describe('PvpShieldService', () => {
  let pvpShieldService: PvpShieldService;
  let testingModule: TestingModule;
  let PvpShieldModel: Model<PvpShieldDocument>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('pvp shield service'),
        MongooseModule.forFeature([
          { name: 'PvpShield', schema: PvpShieldSchema },
        ]),
      ],
      providers: [PvpShieldService],
    }).compile();

    pvpShieldService = testingModule.get<PvpShieldService>(PvpShieldService);
    PvpShieldModel = testingModule.get<Model<PvpShieldDocument>>(
      'PvpShieldModel',
    );
  });

  afterEach(async () => {
    await closeInMongodConnection('pvp shield service');
  });

  afterEach(async () => {
    await PvpShieldModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(pvpShieldService).toBeDefined();
  });

  it('apply shield', async () => {
    const PLAYER_ID = 'playerid';

    await pvpShieldService.applyShield(PLAYER_ID);
    const shieldsV1 = await PvpShieldModel.find({});
    expect(shieldsV1.length).toEqual(1);

    await pvpShieldService.applyShield(PLAYER_ID);
    const shieldsV2 = await PvpShieldModel.find({});
    expect(shieldsV2.length).toEqual(1);
    expect(
      shieldsV1[0].shieldStartingTime.toISOString() !==
        shieldsV2[0].shieldStartingTime.toISOString(),
    ).toBeTruthy();
  });

  it('drop shield', async () => {
    const PLAYER_ID = 'player id';

    await pvpShieldService.applyShield(PLAYER_ID);
    const shieldsV1 = await PvpShieldModel.find({});
    expect(shieldsV1.length).toEqual(1);

    await pvpShieldService.dropShield(PLAYER_ID);
    const shieldsV2 = await PvpShieldModel.find({});
    expect(shieldsV2.length).toEqual(0);
  });

  it('can tell if a player is shielded', async () => {
    const PLAYER_A = 'shielded player';
    await pvpShieldService.applyShield(PLAYER_A);
    expect(await pvpShieldService.isShielded(PLAYER_A)).toBeTruthy();

    expect(await pvpShieldService.isShielded('NO SHIELD AT ALL')).toBeFalsy();

    const playerADocument = await PvpShieldModel.findOne({
      memberDiscordId: PLAYER_A,
    });
    playerADocument.shieldStartingTime = moment(
      playerADocument.shieldStartingTime,
    )
      .subtract(SHIELD_DURATION_IN_HOURS + 1, 'hours')
      .toDate();
    await playerADocument.save();
    expect(await pvpShieldService.isShielded(PLAYER_A)).toBeFalsy();
  });
});
