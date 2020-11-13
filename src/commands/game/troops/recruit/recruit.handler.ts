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
  LIGHT_INFANTRY_ATK,
  LIGHT_INFANTRY_DAILY_FOOD_UPKEEP,
  LIGHT_INFANTRY_DAILY_GOLD_UPKEEP,
  LIGHT_INFANTRY_DEF,
  LIGHT_INFANTRY_FOOD_COST,
  SCAVENGER_BUILDING_MATERIAL_YIELD,
  SCAVENGER_FOOD_COST,
  SCAVENGER_WORK_COST,
} from '../../../../game/troops.constants';
import { GameService } from '../../../../game/game.service';
import { TROOP_TYPE } from '../../../../troops/troops.interface';

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
      if (new RegExp(`^${TROOP_TYPE.GATHERER}`, 'i').test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitGatherer(message.author.id);
      } else if (new RegExp(`^${TROOP_TYPE.SCAVENGER}`, 'i').test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitScavenger(message.author.id);
      } else if (new RegExp(`^${TROOP_TYPE.GUARD}`, 'i').test(troopType)) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitGuard(message.author.id);
      } else if (
        new RegExp(`^${TROOP_TYPE.LIGHT_INFANTRY}`, 'i').test(troopType)
      ) {
        await this.gameService.recruitmentGuard(message.author.id);
        await this.troopsService.recruitLightInfantry(message.author.id);
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
          name: TROOP_TYPE.GATHERER,
          value: `cost ${GATHERER_CREATION_FOOD_COST} :food:, produce ${GATHERER_WORK_FOOD_YIELD} :food: while working`,
        },
        {
          name: TROOP_TYPE.SCAVENGER,
          value: `cost ${SCAVENGER_FOOD_COST} :food:, produce ${SCAVENGER_BUILDING_MATERIAL_YIELD} :building_materials: in exchange for ${SCAVENGER_WORK_COST} :food: while working`,
        },
        {
          name: TROOP_TYPE.GUARD,
          value: `cost ${GUARD_FOOD_COST} :food:, provide ${GUARD_ATK} :ATK: and ${GUARD_DEF} :DEF: per guard. :warning: Will consume every day ${GUARD_DAILY_UPKEEP} :food:`,
        },
        {
          name: TROOP_TYPE.LIGHT_INFANTRY,
          value: `cost ${LIGHT_INFANTRY_FOOD_COST} :food:, provide ${LIGHT_INFANTRY_ATK} :ATK: and ${LIGHT_INFANTRY_DEF} :DEF:. :warning: Will consume every day ${LIGHT_INFANTRY_DAILY_FOOD_UPKEEP} :food: and ${LIGHT_INFANTRY_DAILY_GOLD_UPKEEP} :gold:`,
        },
      ]);
    message.channel.send(embed);
  }
}
