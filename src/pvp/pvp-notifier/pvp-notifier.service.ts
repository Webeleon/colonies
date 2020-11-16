import { Injectable, Logger } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';

import { DiscordService } from '../../discord/discord.service';
import { MemberService } from '../../member/member.service';
import { RaidResult } from '../pvp.interfaces';

@Injectable()
export class PvpNotifierService {
  constructor(
    private readonly discord: DiscordService,
    private readonly memberService: MemberService,
  ) {}

  async notifyVictim(result: RaidResult): Promise<void> {
    const canNotify = await this.memberService.canNotify(result.defender);
    if (!canNotify) return;

    const member = await this.discord.client.users.fetch(result.defender);

    const embed = new MessageEmbed()
      .setColor(result.success ? 'RED' : 'GREEN')
      .setFooter(
        `You received this notification because you played in the last 24h`,
      );

    const desccription = [
      `:crossed_swords: You have been attacked by <@!${result.attacker}> :crossed_swords:\n\n`,
    ];
    if (result.success) {
      desccription.push(`You lost some resources:`);

      desccription.push(`${result.stolen.food} :food:`);
      desccription.push(
        `${result.stolen.buildingMaterials} :building_materials:`,
      );
    } else {
      desccription.push(
        `:tada: You crushed the ennemy and won ${result.gold} :gold:`,
      );
    }

    embed.setDescription(desccription.join('\n'));

    member.send(embed);
  }
}
