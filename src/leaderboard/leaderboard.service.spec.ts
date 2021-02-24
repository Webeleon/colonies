import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { LeaderboardService, leaderboardTopics } from './leaderboard.service';
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

  it('global tops', async () => {
    for (let i = 0; i < 12; i++) {
      await leaderboardModel.create({
        memberDiscordId: `total${i}`,
        username: `total${i}`,
        score: i,
      });
      await leaderboardModel.create({
        memberDiscordId: `pvp${i}`,
        username: `pvp${i}`,
        pvpScore: i,
      });
      await leaderboardModel.create({
        memberDiscordId: `resources${i}`,
        username: `resources${i}`,
        ressourcesScore: i,
      });
      await leaderboardModel.create({
        memberDiscordId: `buildings${i}`,
        username: `buildings${i}`,
        buildingScore: i,
      });
      await leaderboardModel.create({
        memberDiscordId: `troops${i}`,
        username: `troop${i}`,
        troopsScore: i,
      });
    }

    const globalGeneralTop10 = await leaderboardService.globalTop(
      leaderboardTopics.TOTAL,
    );
    expect(globalGeneralTop10.length).toEqual(10);
    expect(globalGeneralTop10[0].score).toEqual(11);

    const globalPvpTop10 = await leaderboardService.globalTop(
      leaderboardTopics.PVP,
    );
    expect(globalPvpTop10.length).toEqual(10);
    expect(globalPvpTop10[0].pvpScore).toEqual(11);

    const globalResourcesTop10 = await leaderboardService.globalTop(
      leaderboardTopics.RESOURCES,
    );
    expect(globalResourcesTop10.length).toEqual(10);
    expect(globalResourcesTop10[0].ressourcesScore).toEqual(11);

    const globalBuildingsTop10 = await leaderboardService.globalTop(
      leaderboardTopics.BUILDINGS,
    );
    expect(globalBuildingsTop10.length).toEqual(10);
    expect(globalBuildingsTop10[0].buildingScore).toEqual(11);

    const globalTroopsTop10 = await leaderboardService.globalTop(
      leaderboardTopics.TROOPS,
    );
    expect(globalTroopsTop10.length).toEqual(10);
    expect(globalTroopsTop10[0].troopsScore).toEqual(11);
  });
});
