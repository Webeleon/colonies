import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { LeaderboardService } from './leaderboard.service';
import {
  LeaderboardDocument,
  LeaderBoardSchema,
  LEADERBOARD_MODEL_NAME,
} from './leaderboard.model';
import { MemberModule } from '../member/member.module';

describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;
  let leaderboardModel: Model<LeaderboardDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: LEADERBOARD_MODEL_NAME, schema: LeaderBoardSchema },
        ]),
        MemberModule,
      ],
      providers: [LeaderboardService],
    }).compile();

    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
    leaderboardModel = module.get(LEADERBOARD_MODEL_NAME + 'Model');
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(leaderboardService).toBeDefined();
  });

  it('get or create a leaderboard entry', async () => {
    expect(await leaderboardModel.count({})).toEqual(0);
    await leaderboardService.getMemberLeaderboard('TEST');
    expect(await leaderboardModel.count({})).toEqual(1);
  });
});
