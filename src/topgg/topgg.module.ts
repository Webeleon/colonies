import { Module } from '@nestjs/common';
import { TopggService } from './topgg.service';
import { ConfigModule } from '../config/config.module';
import { MemberModule } from '../member/member.module';
import { DiscordModule } from '../discord/discord.module';
import { TopggVoteRewardService } from './topgg-vote-reward/topgg-vote-reward.service';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TroopsModule } from '../troops/troops.module';

@Module({
  imports: [
    ConfigModule,
    MemberModule,
    DiscordModule,
    TroopsModule,
    ResourcesModule,
    BuildingsModule,
  ],
  providers: [TopggService, TopggVoteRewardService],
  exports: [TopggService],
})
export class TopggModule {}
