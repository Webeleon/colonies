import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { TroopsService } from '../../../troops/troops.service';

@Injectable()
export class TroopsHandler implements ICommandHandler {
  constructor(private readonly troopsService: TroopsService) {}

  name = 'troops';
  description = 'display troops for the requesting member';

  test(content: string): boolean {
    return /^colo?n?i?e? troops/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const troops = await this.troopsService.getMemberTroops(message.author.id);
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${message.author.username} troops`)
      .addField('Gatherers', troops.gatherers ?? 0)
      .addField('Scavengers', troops.scavengers ?? 0);

    message.channel.send(embed);
  }
}
