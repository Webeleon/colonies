import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { ResourcesService } from '../../../resources/resources.service';

@Injectable()
export class ResourcesHandler implements ICommandHandler {
  constructor(
    private readonly resourcesService: ResourcesService,
  ) {}

  name = 'colonie resources';
  description = 'display colonie resources';

  test(content: string): boolean {
    return /^colonie resources/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    const resources = await this.resourcesService.getResourcesForMember(message.author.id);

    const resourceEmbed = new MessageEmbed()
      .setTitle(`${message.author.username} resources inventory`)
      .addField('Food', resources.food);

    message.channel.send(resourceEmbed);
  }
}
