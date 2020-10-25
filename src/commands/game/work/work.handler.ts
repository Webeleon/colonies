import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { WorkService } from '../../../work/work.service';

@Injectable()
export class WorkHandler implements ICommandHandler {
  constructor(private readonly workService: WorkService) {}

  name = 'colonie work';
  description = 'perform troops work action';

  test(content: string): boolean {
    return /^colonie work/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    // TODO: rate limit to define

    try {
      const report = await this.workService.startColonieWork(message.author.id);
      const embed = new MessageEmbed().setDescription(
        `*Work report for <@!${message.author.id}>*`,
      );
      embed.addField(
        `${report.gatherers.numberOfTroops} gatherers`,
        `produced ${report.gatherers.foodProduced} food`,
      );
      if (report.scavengers.error) {
        embed.setColor('YELLOW');
        embed.addField(
          `scavengers failed to performed their work`,
          report.scavengers.error.message,
          true,
        );
      } else {
        embed.setColor('BLUE');
        embed.addField(
          `${report.scavengers.numberOfTroops} scavengers`,
          `consumed ${report.scavengers.foodConsumed} food to produce ${report.scavengers.buildingMaterialsProduced}`,
          true,
        );
      }

      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Failed to work')
        .setDescription(error.message);

      message.channel.send(errorEmbed);
    }
  }
}
