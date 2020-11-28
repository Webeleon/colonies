import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';
import { ConfigService } from '../../../config/config.service';
import { TopggService } from '../../../topgg/topgg.service';
import {
  VOTE_BUILDING_MATERIALS_REWARD,
  VOTE_FOOD_REWARD,
  VOTE_GOLD_REWARD,
  WEEKEND_VOTE_HOUSE_REWARD,
  WEEKEND_VOTE_LIGHT_INFANTRY_REWARD,
} from '../../../game/vote.constants';

@Injectable()
export class VoteHandler implements ICommandHandler {
  constructor(
    private readonly config: ConfigService,
    private readonly topGG: TopggService,
  ) {}

  name = 'colonie vote';
  description = 'send a link to vote on top.gg';
  regex = new RegExp('^colonie vote$', 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const url = this.config.getBotVoteLink();
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setURL(url)
      .setDescription(await this.getDescription())
      .setTitle('Get rewarded to vote on top.gg for colonie');

    await message.channel.send(embed);
  }

  async getDescription(): Promise<string> {
    const weekend = await this.topGG.getWeekendMultiplier();
    const weekendTroopBonus = !weekend
      ? ''
      : `
 :star::star::star: Weekend Bonus :star::star::star:
 :ninja: ${WEEKEND_VOTE_LIGHT_INFANTRY_REWARD} light infantry
 :house_with_garden: ${WEEKEND_VOTE_HOUSE_REWARD} house
    `;
    return `[vote for colonie on top.gg](${this.config.getBotVoteLink()}) and receive:
${
  weekend
    ? ':star::star::star: *Resource rewards doubled on weekends!* :star::star::star:'
    : ''
}
:apple: ${weekend ? VOTE_FOOD_REWARD * 2 : VOTE_FOOD_REWARD} food :apple:
:bricks: ${
      weekend
        ? VOTE_BUILDING_MATERIALS_REWARD * 2
        : VOTE_BUILDING_MATERIALS_REWARD
    } building materials :bricks:
:moneybag: ${weekend ? VOTE_GOLD_REWARD * 2 : VOTE_GOLD_REWARD} gold :moneybag:
${weekendTroopBonus}
[${this.config.getBotVoteLink()}](${this.config.getBotVoteLink()})
**get reminded to vote**: *colonie vote reminder on*
    `;
  }
}
