import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import {
  FARM_TYPE,
  FARMS_CONSTRUCTION_COST,
  FARMS_YIELD,
  HOUSE_ADDED_TROOPS,
  HOUSE_CONSTRUCTION_COST,
  HOUSE_TYPE,
  LANDFILL_TYPE,
  LANDFILLS_CONSTRUCTION_COST,
  LANDFILLS_YIELD,
  PITTRAP_CONSTRUCTION_COST,
  PITTRAP_DEF,
  PITTRAP_TYPE,
  PRODUCTION_INTERVAL_IN_HOURS,
} from '../../../../game/buildings.constants';
import { BuildingsService } from '../../../../buildings/buildings.service';

@Injectable()
export class BuildHandler implements ICommandHandler {
  constructor(private readonly buildingsService: BuildingsService) {}

  name = 'colonie build <building type>';
  descriptions = 'build the specific building';
  regex = new RegExp('colonie build (.+)?', 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, buildingType = ''] = message.content.match(this.regex);
    Logger.debug(buildingType);
    try {
      const embed = await this.dispatchBuildByBuildingType(
        buildingType.trim(),
        message,
      );
      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`failed to build ${buildingType}`)
        .setDescription(error.message);
      message.channel.send(errorEmbed);
    }
  }

  private async dispatchBuildByBuildingType(
    buildingType: string,
    message: Message,
  ): Promise<MessageEmbed> {
    const embed = new MessageEmbed();

    if (buildingType === HOUSE_TYPE) {
      await this.buildingsService.buildHouse(message.author.id);
    } else if (buildingType === FARM_TYPE) {
      await this.buildingsService.buildFarm(message.author.id);
    } else if (buildingType === LANDFILL_TYPE) {
      await this.buildingsService.buildLandfills(message.author.id);
    } else if (buildingType === PITTRAP_TYPE) {
      await this.buildingsService.buildPitTrap(message.author.id);
    } else {
      embed.setColor('BLUE');
      embed.setTitle(`Invalid building types: \`${buildingType}\``);
      embed.addFields([
        {
          name: `${HOUSE_TYPE} (${HOUSE_CONSTRUCTION_COST} :building_materials:)`,
          value: `Home allow you to have ${HOUSE_ADDED_TROOPS} troops`,
        },
        {
          name: `${FARM_TYPE} (${FARMS_CONSTRUCTION_COST} :building_materials:)`,
          value: `produce ${FARMS_YIELD} foods every ${PRODUCTION_INTERVAL_IN_HOURS}h`,
        },
        {
          name: `${LANDFILL_TYPE} (${LANDFILLS_CONSTRUCTION_COST} :construction_materials:)`,
          value: `produce ${LANDFILLS_YIELD} building materials every ${PRODUCTION_INTERVAL_IN_HOURS}h`,
        },
        {
          name: `${PITTRAP_TYPE} (${PITTRAP_CONSTRUCTION_COST} :building_materials:)`,
          value: `Passive defense: add ${PITTRAP_DEF} defense to the colonie per ${PITTRAP_TYPE}`,
        },
      ]);
      return embed;
    }

    embed.setTitle(`You've successfully built a ${buildingType}`);
    embed.setColor('GREEN');
    return embed;
  }
}
