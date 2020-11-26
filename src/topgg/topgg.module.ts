import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TopggService } from './topgg.service';
import { ConfigModule } from '../config/config.module';
import { MemberModule } from '../member/member.module';
import { DiscordModule } from '../discord/discord.module';
import { TopggVoteRewardService } from './topgg-vote-reward/topgg-vote-reward.service';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TroopsModule } from '../troops/troops.module';
import { VoteReminderService } from './vote-reminder-service/vote-reminder.service';
import {
  VOTE_REMINDER_MODEL_NAME,
  VoteReminderSchema,
} from './vote-reminder-service/vote-reminder.model';

@Module({
  imports: [
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
  exports: [TopggService, VoteReminderService],
})
export class TopggModule {}
