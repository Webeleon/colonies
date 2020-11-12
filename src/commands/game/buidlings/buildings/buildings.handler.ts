import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import { BuildingsService } from '../../../../buildings/buildings.service';
import {
  FARM_TYPE,
  HOUSE_TYPE,
  LANDFILL_TYPE,
  PITTRAP_TYPE,
} from '../../../../game/buildings.constants';

@Injectable()
export class BuildingsHandler implements ICommandHandler {
  constructor(private readonly buildingService: BuildingsService) {}

  name = 'colonie buildings';
  descriptions = 'list colonie buildings';

  test(content: string): boolean {
    return /^colonie buildings/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    // TODO: make it nice and not ugly as frak
    const buildings = await this.buildingService.getBuildingsForMember(
      message.author.id,
    );
    const embed = new MessageEmbed().setColor('BLUE')
      .setDescription(`**<@!${message.author.id}> buildings**

**Housing**
*${HOUSE_TYPE}* : ${buildings.houses}

**Production**
*${FARM_TYPE}* : ${buildings.farms}
*${LANDFILL_TYPE}* : ${buildings.landfills}

**War**
*${PITTRAP_TYPE}* : ${buildings.pitTrap}
      `);

    message.channel.send(embed);
  }
}
