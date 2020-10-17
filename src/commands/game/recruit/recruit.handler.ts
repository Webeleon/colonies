import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { TroopsService } from '../../../troops/troops.service';
import {
  GATHERER_CREATION_FOOD_COST,
  GATHERER_WORK_FOOD_YIELD,
  SCAVENGER_BUILDING_MATERIAL_YIELD,
  SCAVENGER_FOOD_COST,
  SCAVENGER_WORK_COST,
} from '../../../game/troops.constants';

@Injectable()
export class RecruitHandler implements ICommandHandler {
  constructor(private readonly troopsService: TroopsService) {}
  name = 'recruit <troop type>';
  descriptions = 'recruit a trop of the specified type';

  test(content: string): boolean {
    return /^colonie recruit \w+/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const { content } = message;
    const [command, troopType] = content.match(/colonie recruit (\w+)/i);
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
        return this.sendHelp(message);
      }

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(
          `${
            message.author.username
          } successfully recruited a ${troopType.toLowerCase()}`,
        );
      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(
          `${
            message.author.username
          } failed to recruit ${troopType.toLowerCase()}`,
        )
        .setDescription(error.message);
      message.channel.send(errorEmbed);
    }
  }

  sendHelp(message: Message): void {
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('recruitment help')
      .setDescription('here are the valid troops type')
      .addFields([
        {
          name: 'gatherers',
          value: `cost ${GATHERER_CREATION_FOOD_COST} food, produce ${GATHERER_WORK_FOOD_YIELD} food while working`,
        },
        {
          name: 'scavengers',
          value: `cost ${SCAVENGER_FOOD_COST} food, produce ${SCAVENGER_BUILDING_MATERIAL_YIELD} building materials in exchange for ${SCAVENGER_WORK_COST} food while working`,
        },
      ]);
    message.channel.send(embed);
  }
}
