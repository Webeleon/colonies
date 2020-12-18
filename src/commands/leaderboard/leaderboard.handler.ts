import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { LeaderBoard } from '../../leaderboard/leaderboard.model';
import {
  LeaderboardService,
  leaderboardTopics,
} from '../../leaderboard/leaderboard.service';
import { ICommandHandler } from '../ICommandHandler';

export enum leaderboardScopes {
  GLOBAL = 'global',
  SERVER = 'server',
}

@Injectable()
export class LeaderboardHandler implements ICommandHandler {
  name = 'leaderboard';
  regex = new RegExp(
    `^colonie leaderboard\\s*(${Object.values(leaderboardScopes).join(
      '|',
    )})?\\s*(${Object.values(leaderboardTopics).join('|')})?`,
    'i',
  );

  constructor(private readonly leaderboardService: LeaderboardService) {}

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const scope = this.extractScope(message.content);
    const topic = this.extractTopic(message.content);

    if (scope === leaderboardScopes.GLOBAL) {
      await this.send(message, await this.leaderboardService.globalTop(topic));
    } else {
      await this.send(
        message,
        await this.leaderboardService.serverTop(message.guild.id, topic),
      );
    }
  }

  private async send(message: Message, leaderboard: LeaderBoard[]) {
    const embed = new MessageEmbed();

    const description = leaderboard
      .map(
        (entry) => `**${entry.username}**
total: ${entry.score}, pvp: ${entry.pvpScore}, resources: ${entry.ressourcesScore}, buildings: ${entry.buildingScore}, troops: ${entry.troopsScore}`,
      )
      .join('\n');
    embed.setDescription(description);

    if (leaderboard[0]?.userAvatarUrl)
      embed.setThumbnail(leaderboard[0].userAvatarUrl);

    await message.channel.send(embed);
  }

  extractScope(content: string): leaderboardScopes {
    const [cmd, scope] = content.match(this.regex);
    return scope === leaderboardScopes.GLOBAL
      ? leaderboardScopes.GLOBAL
      : leaderboardScopes.SERVER;
  }

  extractTopic(content: string): leaderboardTopics {
    const [cmd, scope, topic] = content.match(this.regex);
    if (Object.values(leaderboardTopics).includes(topic as leaderboardTopics))
      return topic as leaderboardTopics;
    return leaderboardTopics.TOTAL;
  }
}
