import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import { TroopsService } from '../../../../troops/troops.service';
import {
  GATHERER_CREATION_FOOD_COST,
  GATHERER_WORK_FOOD_YIELD,
  GUARD_ATK,
  GUARD_DAILY_UPKEEP,
  GUARD_DEF,
  GUARD_FOOD_COST,
  SCAVENGER_BUILDING_MATERIAL_YIELD,
  SCAVENGER_FOOD_COST,
  SCAVENGER_WORK_COST,
} from '../../../../game/troops.constants';
import { GameService } from '../../../../game/game.service';

@Injectable()
export class RecruitHandler implements ICommandHandler {
  constructor(
    private readonly troopsService: TroopsService,
    private readonly gameService: GameService,
  ) {}
  name = 'recruit <troop type>';
  descriptions = 'recruit a trop of the specified type';
  regex = new RegExp(`^colonie recruit (.*)`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const { content } = message;
    const [command, troopType] = content.match(this.regex);
    Logger.debug(troopType, 'RecruitHandler');

    if (!troopType) {
      throw new Error('No troop type provided');
    }

    try {
      if (/^gatherer/i.test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitGatherer(message.author.id);
      } else if (/^scavenger/i.test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitScavenger(message.author.id);
      } else if (/^guard/i.test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitGuard(message.author.id);
      } else {
        return RecruitHandler.sendHelp(message);
      }

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(
          `**<@!${
            message.author.id
          }> successfully recruited a ${troopType.toLowerCase()}**`,
        );
      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed().setColor('RED').setDescription(
        `**<@!${
          message.author.id
        }> failed to recruit ${troopType.toLowerCase()}**
${error.message}
`,
      );
      message.channel.send(errorEmbed);
    }
  }

  public static sendHelp(message: Message): void {
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('recruitment help')
      .setDescription('here are the valid troops type')
      .addFields([
        {
          name: 'gatherer',
          value: `cost ${GATHERER_CREATION_FOOD_COST} :food:, produce ${GATHERER_WORK_FOOD_YIELD} :food: while working`,
        },
        {
          name: 'scavenger',
          value: `cost ${SCAVENGER_FOOD_COST} :food:, produce ${SCAVENGER_BUILDING_MATERIAL_YIELD} :building_materials: in exchange for ${SCAVENGER_WORK_COST} :food: while working`,
        },
        {
          name: 'guard',
          value: `cost ${GUARD_FOOD_COST} :food:, provide ${GUARD_DEF} :DEF: and ${GUARD_ATK} :ATK: per guard. Will consume every day ${GUARD_DAILY_UPKEEP} :food:`,
        },
      ]);
    message.channel.send(embed);
  }
}
