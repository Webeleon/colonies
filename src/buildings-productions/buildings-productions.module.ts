import { Module } from '@nestjs/common';
import { BuildingsProductionsService } from './buildings-productions.service';
import { BuildingsModule } from '../buildings/buildings.module';
import { MemberModule } from '../member/member.module';
import { DiscordModule } from '../discord/discord.module';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [BuildingsModule, MemberModule, DiscordModule, ResourcesModule],
  providers: [BuildingsProductionsService],
})
export class BuildingsProductionsModule {}
