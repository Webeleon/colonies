import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { MemberService } from './member.service';
import { memberSchema } from './member.model';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { IMemberDocument } from './member.interface';

describe('MemberService', () => {
  let service: MemberService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Member', schema: memberSchema }]),
      ],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can provide a members cursor', async () => {
    const cursor = await service.getMembersCursor();
    expect(cursor).toBeDefined();
  });

  describe('can notify', () => {
    afterEach(async () => {
      const MemberModel = module.get<Model<IMemberDocument>>('MemberModel');
      await MemberModel.deleteMany({});
    });

    it('allow notification if player have interacted in the last 24h', async () => {
      const PLAYER_A = 'regular player';
      await service.markInteraction(PLAYER_A);
      expect(await service.canNotify(PLAYER_A)).toBeTruthy();
    });

    it('block notification if the target have never interacted with the bot', async () => {
      const PLAYER_B = 'target that never played';
      expect(await service.canNotify(PLAYER_B)).toBeFalsy();
    });

    it('block notification if a player have not played in the last 24h', async () => {
      const PLAYER_C = 'target that have not played in the last 24h';
      const playerDocument = await service.getMember(PLAYER_C);
      playerDocument.lastInteraction = moment().subtract(25, 'hours').toDate();
      expect(await service.canNotify(PLAYER_C)).toBeFalsy();
    });
  });
});
