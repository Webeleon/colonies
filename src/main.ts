import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { DiscordService } from './discord/discord.service';
import { CommandsService } from './commands/commands.service';
import { TopggService } from './topgg/topgg.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const discordService = app.get(DiscordService);
  const commandService = app.get(CommandsService);
  const topGGService = app.get(TopggService);

  await app.listen(config.port, async () => {
    Logger.log(`Colonie node on port ${config.port}`, 'main');
    const client = await discordService.connect();
    commandService.register(client);
    topGGService.register(config.topGGBotId);
  });
}
bootstrap();

process.on('uncaughtException', (error) => {
  Logger.error(`UNCAUGHT EXCEPTION => ${error.message}`, error.stack);
});
