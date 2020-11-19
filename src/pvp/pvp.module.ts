import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PvpService } from './pvp.service';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { DiscordModule } from '../discord/discord.module';
import { MemberModule } from '../member/member.module';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';
import { PvpShieldService } from './pvp-shield/pvp-shield.service';
import { PvpShieldSchema } from './pvp-shield/pvp-shield.model';

@Module({
  imports: [
    DiscordModule,
    MemberModule,
    TroopsModule,
    BuildingsModule,
    ResourcesModule,
    MongooseModule.forFeature([{ name: 'PvpShield', schema: PvpShieldSchema }]),
  ],
  providers: [
    PvpService,
    PvpNotifierService,
    PvpComputerService,
    PvpShieldService,
  ],
  exports: [PvpService],
})
export class PvpModule {}
