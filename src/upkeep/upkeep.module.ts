import { Module } from '@nestjs/common';

import { UpkeepService } from './upkeep.service';

import { DiscordModule } from '../discord/discord.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { TroopsModule } from '../troops/troops.module';
import { MemberModule } from '../member/member.module';
import { ResourcesModule } from '../resources/resources.module';
import { UpkeepNotifierService } from './upkeep-notifier/upkeep-notifier.service';
import { UpkeepTaxesService } from './upkeep-taxes/upkeep-taxes.service';
import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector/upkeep-taxes-collector.service';

@Module({
  imports: [
    DiscordModule,
    BuildingsModule,
    TroopsModule,
    MemberModule,
    ResourcesModule,
  ],
  providers: [
    UpkeepService,
    UpkeepNotifierService,
    UpkeepTaxesService,
    UpkeepTaxesCollectorService,
  ],
})
export class UpkeepModule {}
