import { Injectable, Logger } from '@nestjs/common';
import * as TopGG from 'dblapi.js';

import { ConfigService } from '../config/config.service';
import { TopggVoteRewardService } from './topgg-vote-reward/topgg-vote-reward.service';
import { VoteReminderService } from './vote-reminder-service/vote-reminder.service';

@Injectable()
export class TopggService {
  private botId: string;
  private topGGClient: TopGG;

  constructor(
    private readonly config: ConfigService,
    private readonly voteReward: TopggVoteRewardService,
    private readonly voteReminderService: VoteReminderService,
  ) {}

  register(botId: string) {
    this.topGGClient = new TopGG(this.config.topGGToken, {
      webhookPort: this.config.topGGHookPort,
      webhookAuth: this.config.topGGHookPassword,
    });
    this.botId = botId;

    this.topGGClient.webhook.on('ready', (hook) => {
      Logger.debug(hook, 'top.gg');
      Logger.log(
        `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`,
        'top.gg',
      );
    });
    this.topGGClient.webhook.on('vote', async (vote) => {
      Logger.log(`User with Id ${vote.user} as voted!`, 'top.gg');
      if (vote.bot === botId) {
        Logger.log(`And for our bot!`, 'top.gg');
        await this.voteReminderService.markVote(vote.user);
        await this.voteReward.reward(vote);
      }
    });
  }

  async getWeekendMultiplier(): Promise<boolean> {
    return this.topGGClient.isWeekend();
  }
}
