import { Module } from '@nestjs/common';

import { CommandsService } from './commands.service';

import { ConfigModule } from '../config/config.module';
import { DiscordModule } from '../discord/discord.module';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { GameModule } from '../game/game.module';
import { MemberModule } from '../member/member.module';
import { WorkModule } from '../work/work.module';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { TroopsReportHandler } from './game/troops/troops-report/troopsReport.handler';
import { WorkHandler } from './game/work/work.handler';
import { RecruitHandler } from './game/troops/recruit/recruit.handler';
import { ResourcesHandler } from './game/resources/resources.handler';
import { TroopsModule } from '../troops/troops.module';
import { BuildHandler } from './game/buidlings/build/build.handler';
import { BuildingsHandler } from './game/buidlings/buildings/buildings.handler';
import { DismissHandler } from './game/troops/dismiss/dismiss.handler';
import { RaidHandler } from './pvp/raid/raid.handler';
import { PvpModule } from '../pvp/pvp.module';
import { VoteHandler } from './vote/vote.handler';
import { TopggModule } from '../topgg/topgg.module';

@Module({
  imports: [
    ConfigModule,
    DiscordModule,
    ResourcesModule,
    TroopsModule,
    WorkModule,
    BuildingsModule,
    GameModule,
    MemberModule,
    PvpModule,
    TopggModule,
  ],
  providers: [
    CommandsService,
    PingHandler,
    InviteHandler,
    HelpHandler,
    StatusHandler,
    TroopsReportHandler,
    WorkHandler,
    RecruitHandler,
    ResourcesHandler,
    BuildHandler,
    BuildingsHandler,
    DismissHandler,
    RaidHandler,
    VoteHandler,
  ],
  exports: [CommandsService],
})
export class CommandsModule {}
