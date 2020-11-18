import { Test, TestingModule } from '@nestjs/testing';

import { TopggService } from './topgg.service';
import { ConfigModule } from '../config/config.module';
import { MemberModule } from '../member/member.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { DiscordModule } from '../discord/discord.module';
import { TroopsModule } from '../troops/troops.module';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TopggVoteRewardService } from './topgg-vote-reward/topgg-vote-reward.service';

describe('TopggService', () => {
  let service: TopggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule,
        MemberModule,
        DiscordModule,
        TroopsModule,
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [TopggService, TopggVoteRewardService],
    }).compile();

    service = module.get<TopggService>(TopggService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
