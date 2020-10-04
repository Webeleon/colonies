import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { TroopsService } from '../../../troops/troops.service';

@Injectable()
export class RecruitHandler implements ICommandHandler {
  constructor(
    private readonly troopsService: TroopsService,
  ) {}
  name = 'recruit <troop type>';
  descriptions = 'recruit a trop of the specified type';

  test(content: string): boolean {
    return /^colonie recruit \w+/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const { content } = message;
    const [ command, troopType ] = content.match(/colonie recruit (\w+)/i);
    Logger.debug(troopType, 'RecruitHandler');

    if (!troopType) {
      throw new Error('No troop type provided');
    }

    try {
      if (/^gatherer/i.test(troopType)) {
        await this.troopsService.recruitGatherer(message.author.id);
      } else if (/^scavenger/i.test(troopType)) {
        await this.troopsService.recruitScavenger(message.author.id);
      } else {
        throw new Error(`\`${troopType}\` is not a valid troop type`)
      }

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${message.author.username} successfully recruited a ${troopType.toLowerCase()}`);
      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${message.author.username} failed to recruit ${troopType.toLowerCase()}`)
        .setDescription(error.message)
      message.channel.send(errorEmbed);
    }
  }
}

