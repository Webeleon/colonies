import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageEmbed } from 'discord.js';

import { DiscordService } from '../../discord/discord.service';
import { VoteReminderService } from '../vote-reminder-service/vote-reminder.service';
import { TopggService } from '../topgg.service';
import { TopggVoteRewardService } from '../topgg-vote-reward/topgg-vote-reward.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class TopggScheduledService {
  constructor(
    private readonly configs: ConfigService,
    private readonly discordService: DiscordService,
    private readonly voteReminderService: VoteReminderService,
    private readonly topgg: TopggService,
  ) {}

  @Cron('0 * * * *')
  async sendReminders(): Promise<void> {
    const remindersToSend = await this.voteReminderService.getSubsToNotify();
    if (remindersToSend.length > 0)
      Logger.log(
        `Sending ${remindersToSend.length} vote reminders`,
        'top.gg scheduled',
      );

    const isWeekend = await this.topgg.getWeekendMultiplier();
    for (const reminderToSend of remindersToSend) {
      await this.notify(reminderToSend.memberDiscordId, isWeekend);
      await this.voteReminderService.markAsNotified(
        reminderToSend.memberDiscordId,
      );
    }
  }

  async notify(memberDiscordId: string, isWeekend: boolean): Promise<void> {
    const member = await this.discordService.client.users.fetch(
      memberDiscordId,
    );

    const reward = TopggVoteRewardService.computeReward(isWeekend);

    const weekendBonus = isWeekend
      ? `:tada::tada::tada: Weekend Bonus :tada::tada::tada:
:house: ${reward.house} house :house:
:ninja: ${reward.lightInfantry} light infantry :ninja:
      `
      : '';
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('You can vote for Colonies!')
      .setDescription(
        `
You can vote on top.gg to receive this reward:
:apple: ${reward.food} food :apple:
:bricks: ${reward.buildingMaterials} building materials :bricks:
:moneybag: ${reward.gold} gold :moneybag:

${weekendBonus}
        `,
      )
      .setURL(this.configs.getBotVoteLink());

    await member.send(embed);
  }
}
