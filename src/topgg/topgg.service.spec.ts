import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

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
import { VoteReminderService } from './vote-reminder-service/vote-reminder.service';
import {
  VOTE_REMINDER_MODEL_NAME,
  VoteReminderSchema,
} from './vote-reminder-service/vote-reminder.model';

describe('TopggService', () => {
  let service: TopggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: VOTE_REMINDER_MODEL_NAME, schema: VoteReminderSchema },
        ]),
        ConfigModule,
        MemberModule,
        DiscordModule,
        TroopsModule,
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [TopggService, TopggVoteRewardService, VoteReminderService],
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
