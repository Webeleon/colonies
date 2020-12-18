import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MemberModule } from '../member/member.module';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardComputerService } from './leaderboard-computer/leaderboard-computer.service';
import { LeaderBoardSchema, LEADERBOARD_MODEL_NAME } from './leaderboard.model';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TroopsModule } from '../troops/troops.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LEADERBOARD_MODEL_NAME, schema: LeaderBoardSchema },
    ]),
    MemberModule,
    ResourcesModule,
    BuildingsModule,
    TroopsModule,
    DiscordModule,
  ],
  providers: [LeaderboardService, LeaderboardComputerService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
