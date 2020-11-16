import { Injectable, Logger } from '@nestjs/common';
import { Client, Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from './ICommandHandler';
import { MemberService } from '../member/member.service';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { ResourcesHandler } from './game/resources/resources.handler';
import { RecruitHandler } from './game/troops/recruit/recruit.handler';
import { TroopsReportHandler } from './game/troops/troops-report/troopsReport.handler';
import { WorkHandler } from './game/work/work.handler';
import { BuildHandler } from './game/buidlings/build/build.handler';
import { BuildingsHandler } from './game/buidlings/buildings/buildings.handler';
import { DismissHandler } from './game/troops/dismiss/dismiss.handler';
import { RaidHandler } from './pvp/raid/raid.handler';

@Injectable()
export class CommandsService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    // dependencies
    private readonly memberService: MemberService,

    // user generic handlers
    private readonly pingHandler: PingHandler,
    private readonly inviteHandler: InviteHandler,
    private readonly helpHandler: HelpHandler,
    private readonly statusHandler: StatusHandler,

    // user game handlers
    private readonly gameResourcesHandler: ResourcesHandler,
    private readonly gameRecruitementHandler: RecruitHandler,
    private readonly gameDismissTroopHandler: DismissHandler,
    private readonly gameTroopsHandler: TroopsReportHandler,
    private readonly gameWorkHandler: WorkHandler,
    private readonly gameBuildingBuildHandler: BuildHandler,
    private readonly gameBuildingsListHandler: BuildingsHandler,
    private readonly pvpRaidHandler: RaidHandler,
  ) {
    this.commandHandlers = [
      pingHandler,
      inviteHandler,
      helpHandler,
      statusHandler,
      gameResourcesHandler,
      gameRecruitementHandler,
      gameDismissTroopHandler,
      gameTroopsHandler,
      gameWorkHandler,
      gameBuildingBuildHandler,
      gameBuildingsListHandler,
      pvpRaidHandler,
    ];
  }
  register(client: Client) {
    for (const command of this.commandHandlers) {
      Logger.log(
        `${command.name} registered: ${command.regex ?? command.description}`,
        'CommandExplorer',
      );
    }

    client.on('message', async (message) => await this.messageHandler(message));
  }

  async messageHandler(message: Message) {
    if (message.author.bot) return;
    const { content } = message;
    Logger.debug(message, 'message listener');
    for (const handler of this.commandHandlers) {
      if (handler.test(content)) {
        try {
          Logger.debug(`executing command [${handler.name}] => ${content}`);
          await this.memberService.markInteraction(message.author.id);
          await handler.execute(message);
        } catch (error) {
          Logger.error(error.message, error.stack);
          const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle(error.message);
          message.channel.send(errorEmbed);
        }
        return;
      }
    }
  }
}
