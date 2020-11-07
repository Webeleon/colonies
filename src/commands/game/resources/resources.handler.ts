import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { ResourcesService } from '../../../resources/resources.service';

@Injectable()
export class ResourcesHandler implements ICommandHandler {
  constructor(private readonly resourcesService: ResourcesService) {}

  name = 'colonie resources';
  description = 'display colonie resources';

  test(content: string): boolean {
    return /^colonie resources/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const resources = await this.resourcesService.getResourcesForMember(
      message.author.id,
    );

    const resourceEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setDescription(`**<@!${message.author.id}> resources inventory**`)
      .addField('Food', resources.food)
      .addField('Building materials', resources.buildingMaterials ?? 0)
      .addField('Gold', resources.gold);

    message.channel.send(resourceEmbed);
  }
}
