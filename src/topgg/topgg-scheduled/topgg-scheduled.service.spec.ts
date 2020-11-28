import { Test, TestingModule } from '@nestjs/testing';
import { DiscordModule } from '../../discord/discord.module';
import { MongooseModule } from '@nestjs/mongoose';

import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { VoteReminderService } from '../vote-reminder-service/vote-reminder.service';
import { TopggScheduledService } from './topgg-scheduled.service';
import { ConfigModule } from '../../config/config.module';
import { TopggService } from '../topgg.service';
import {
  VOTE_REMINDER_MODEL_NAME,
  VoteReminderSchema,
} from '../vote-reminder-service/vote-reminder.model';
import { TopggVoteRewardService } from '../topgg-vote-reward/topgg-vote-reward.service';
import { MemberModule } from '../../member/member.module';
import { ResourcesModule } from '../../resources/resources.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import { TroopsModule } from '../../troops/troops.module';

describe('TopggScheduledService', () => {
  let service: TopggScheduledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: VOTE_REMINDER_MODEL_NAME, schema: VoteReminderSchema },
        ]),
        DiscordModule,
        ConfigModule,
        MemberModule,
        ResourcesModule,
        BuildingsModule,
        TroopsModule,
      ],
      providers: [
        TopggScheduledService,
        VoteReminderService,
        TopggService,
        TopggVoteRewardService,
      ],
    }).compile();

    service = module.get<TopggScheduledService>(TopggScheduledService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
