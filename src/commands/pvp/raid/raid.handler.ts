import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { PvpService } from '../../../pvp/pvp.service';
import { DiscordService } from '../../../discord/discord.service';

@Injectable()
export class RaidHandler implements ICommandHandler {
  constructor(
    private readonly pvp: PvpService,
    private readonly discord: DiscordService,
  ) {}

  name = 'colonie raid @player';
  description =
    'launch an attack on the specified player. All discord member can be attacked!';
  regex = new RegExp(`^colonie (?:raid|attack) <@!?([0-9]+)>`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, targetId] = message.content.match(this.regex);
    if (targetId === message.author.id) {
      throw new Error('You can not raid yourself');
    }
    const target = this.discord.client.users.resolve(targetId);

    if (target.bot) {
      throw new Error(`You can not raid bots!`);
    }

    const result = await this.pvp.raid(message.author.id, target.id);

    const embed = new MessageEmbed()
      .setTitle(
        result.success
          ? `:crossed_swords: Victory!`
          : `:skull: Ouch that hurt...`,
      )
      .setColor(result.success ? 'GREEN' : 'RED');

    const description = [];
    if (result.success) {
      description.push(
        `**You stole resources**`,
        `:apple: ${result.stolen.food} :food:`,
        `:bricks: ${result.stolen.buildingMaterials} :building_materials:`,
        ``,
        `:moneybag: You also won ${result.gold} :gold:`,
      );
    } else {
      description.push(
        `**You lost troops**`,
        `:ninja: ${result.casualties.lightInfantry} light infantry`,
        ``,
        ``,
        `:moneybag: <@!${result.defender}> won ${result.gold} :gold:`,
      );
    }

    embed.setDescription(description.join('\n'));

    await message.channel.send(embed);
  }
}
