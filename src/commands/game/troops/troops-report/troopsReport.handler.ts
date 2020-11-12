import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import { TroopsService } from '../../../../troops/troops.service';

@Injectable()
export class TroopsReportHandler implements ICommandHandler {
  constructor(private readonly troopsService: TroopsService) {}

  name = 'troops';
  description = 'display troops for the requesting member';
  regex = new RegExp(`^colo?n?i?e? troops`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const troops = await this.troopsService.getMemberTroops(message.author.id);
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setDescription(`*<@!${message.author.id}> troops*`)
      .addField('Gatherers', troops.gatherers)
      .addField('Scavengers', troops.scavengers)
      .addField('Guards', troops.guards);

    message.channel.send(embed);
  }
}
