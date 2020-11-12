import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import { TroopsService } from '../../../../troops/troops.service';
import { RecruitHandler } from '../recruit/recruit.handler';
import { TROOP_TYPE } from '../../../../troops/troops.interface';

const debug = (message: any) => Logger.debug(message, 'DismissHandler');

@Injectable()
export class DismissHandler implements ICommandHandler {
  constructor(private readonly troopsService: TroopsService) {}
  name = 'colonie dismiss <troop name> <amount default 1>';
  description = 'fire the requested troops!';
  regex = new RegExp(
    `^colonie dismiss (${Object.values(TROOP_TYPE).join('|')})(?: )?([0-9]*)?`,
    'i',
  );

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, troopType, amountSTR] = message.content.match(this.regex);
    debug(cmd);
    debug(troopType);
    debug(amountSTR);

    const amount = parseInt(amountSTR) || 1;

    if (
      new RegExp(`^${Object.values(TROOP_TYPE).join('|')}`, 'i').test(troopType)
    ) {
      await this.troopsService.dismissTroop(
        message.author.id,
        troopType as TROOP_TYPE,
        amount,
      );
    } else {
      RecruitHandler.sendHelp(message);
      return;
    }

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(`${amount} ${troopType} has been dismissed!`);
    await message.channel.send(embed);
  }
}
