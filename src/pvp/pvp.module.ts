import { Module } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { DiscordModule } from '../discord/discord.module';
import { MemberModule } from '../member/member.module';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';

@Module({
  imports: [
    DiscordModule,
    MemberModule,
    TroopsModule,
    BuildingsModule,
    ResourcesModule,
  ],
  providers: [PvpService, PvpNotifierService, PvpComputerService],
  exports: [PvpService],
})
export class PvpModule {}
