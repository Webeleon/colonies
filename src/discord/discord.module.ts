import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { ConfigModule } from '../config/config.module';
import { ScheduledService } from './scheduled/scheduled.service';

@Module({
  imports: [ConfigModule],
  providers: [DiscordService, ScheduledService],
  exports: [DiscordService],
  controllers: [DiscordController],
})
export class DiscordModule {}
