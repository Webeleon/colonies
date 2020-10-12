import { Injectable, Logger } from '@nestjs/common';
import { Client, Message } from 'discord.js';

import { ICommandHandler } from './ICommandHandler';
import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { ResourcesHandler } from './game/resources/resources.handler';
import { RecruitHandler } from './game/recruit/recruit.handler';
import { TroopsHandler } from './game/troops/troops.handler';
import { WorkHandler } from './game/work/work.handler';
import { BuildHandler } from './game/buidlings/build/build.handler';

@Injectable()
export class CommandsService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    private readonly pingHandler: PingHandler,
    private readonly inviteHandler: InviteHandler,
    private readonly helpHandler: HelpHandler,
    private readonly statusHandler: StatusHandler,
    private readonly gameResourcesHandler: ResourcesHandler,
    private readonly gameRecruitementHandler: RecruitHandler,
    private readonly gameTroopsHandler: TroopsHandler,
    private readonly gameWorkHandler: WorkHandler,
    private readonly gameBuildingBuildHandler: BuildHandler,
  ) {
    this.commandHandlers = [
      pingHandler,
      inviteHandler,
      helpHandler,
      statusHandler,
      gameResourcesHandler,
      gameRecruitementHandler,
      gameTroopsHandler,
      gameWorkHandler,
      gameBuildingBuildHandler,
    ];
  }
  register(client: Client) {
    for (const command of this.commandHandlers) {
      Logger.log(`${command.name} registered`, 'CommandExplorer');
    }

    client.on('message', async message => await this.messageHandler(message));
  }

  async messageHandler(message: Message) {
    if (message.author.bot) return;
    const { content } = message;
    for (const handler of this.commandHandlers) {
      if (handler.test(content)) {
        Logger.debug(`executing command [${handler.name}] => ${content}`);
        await handler.execute(message);
      }
    }
  }
}
