import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import {
  FARM_TYPE, FARMS_CONSTRUCTION_COST,
  FARMS_YIELD,
  HOME_ADDED_TROOPS, HOME_CONSTRUCTION_COST,
  HOME_TYPE,
  LANDFILL_TYPE, LANDFILLS_CONSTRUCTION_COST, LANDFILLS_YIELD, PRODUCTION_INTERVAL_IN_HOURS,
} from '../../../../buildings/buildings.constants';
import { BuildingsService } from '../../../../buildings/buildings.service';

@Injectable()
export class BuildHandler implements ICommandHandler {
  constructor(
    private readonly buildingsService: BuildingsService,
  ) {}

  name = 'colonie build <building type>';
  descriptions = 'build the specific building'

  test(content: string): boolean {
    return /^colonie build( \w+)?/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, buildingType] = message.content.match(/^colonie build( \w+)?/i);

    try {
      const embed = await this.dispatchBuildByBuildingType(buildingType.trim(), message);
      message.channel.send(embed);
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`failed to build ${buildingType}`)
        .setDescription(error.message);
      message.channel.send(errorEmbed);
    }
  }

  private async dispatchBuildByBuildingType(buildingType: string, message: Message): Promise<MessageEmbed> {
    const embed = new MessageEmbed();

    if (buildingType === HOME_TYPE) {
      await this.buildingsService.buildHome(message.author.id);
    } else if (buildingType === FARM_TYPE) {
      await this.buildingsService.buildFarm(message.author.id);
    } else if (buildingType === LANDFILL_TYPE) {
      await this.buildingsService.buildLandfills(message.author.id);
    } else {
      embed.setColor('BLUE');
      embed.setTitle(`Invalid building types: \`${buildingType}\``);
      embed.addFields([
        {
          name: `${HOME_TYPE} (${HOME_CONSTRUCTION_COST} :building_materials:)`,
          value: `Home allow you to have ${HOME_ADDED_TROOPS} troops`,
        },
        {
          name: `${FARM_TYPE} (${FARMS_CONSTRUCTION_COST} :building_materials:)`,
          value: `produce ${FARMS_YIELD} foods every ${PRODUCTION_INTERVAL_IN_HOURS}h`,
        },
        {
          name: `${LANDFILL_TYPE} (${LANDFILLS_CONSTRUCTION_COST} :construction_materials:)`,
          value: `produce ${LANDFILLS_YIELD} building materials every ${PRODUCTION_INTERVAL_IN_HOURS}h`
        }
      ]);
      return embed;
    }

    embed.setTitle(`You've successfully built a ${buildingType}`);
    embed.setColor('GREEN');
    return embed;
  }
}
