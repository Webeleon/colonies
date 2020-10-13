import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../../ICommandHandler';
import { BuildingsService } from '../../../../buildings/buildings.service';
import {
  FARM_TYPE,
  HOME_TYPE,
  LANDFILL_TYPE,
} from '../../../../buildings/buildings.constants';

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

**${HOME_TYPE}** : ${buildings.homes}
**${FARM_TYPE}** : ${buildings.farms}
**${LANDFILL_TYPE}** : ${buildings.landfills}
      `);

    message.channel.send(embed);
  }
}
