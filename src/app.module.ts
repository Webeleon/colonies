import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigService } from './config/config.service';
import { ServerModule } from './server/server.module';
import { MemberModule } from './member/member.module';
import { CommandsModule } from './commands/commands.module';
import { ResourcesModule } from './resources/resources.module';
import { TroopsModule } from './troops/troops.module';
import { WorkModule } from './work/work.module';

const config = new ConfigService();
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }),
    ConfigModule,
    DiscordModule,
    ScheduleModule.forRoot(),
    ServerModule,
    MemberModule,
    CommandsModule,
    ResourcesModule,
    TroopsModule,
    WorkModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
