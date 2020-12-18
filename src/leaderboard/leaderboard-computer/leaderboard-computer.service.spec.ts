import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { MemberModule } from '../../member/member.module';
import { rootMongooseTestModule } from '../../test-utils/mongo/MongooseTestModule';
import {
  LeaderBoardSchema,
  LEADERBOARD_MODEL_NAME,
} from '../leaderboard.model';
import { LeaderboardService } from '../leaderboard.service';
import { LeaderboardComputerService } from './leaderboard-computer.service';
import { DiscordModule } from '../../discord/discord.module';
import { TroopsModule } from '../../troops/troops.module';
import { ResourcesModule } from '../../resources/resources.module';
import { BuildingsModule } from '../../buildings/buildings.module';

describe('LeaderboardComputerService', () => {
  let service: LeaderboardComputerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: LEADERBOARD_MODEL_NAME, schema: LeaderBoardSchema },
        ]),
        MemberModule,
        DiscordModule,
        TroopsModule,
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [LeaderboardService, LeaderboardComputerService],
    }).compile();

    service = module.get<LeaderboardComputerService>(
      LeaderboardComputerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
