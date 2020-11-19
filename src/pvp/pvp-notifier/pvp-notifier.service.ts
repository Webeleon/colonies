import { Injectable, Logger } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';

import { DiscordService } from '../../discord/discord.service';
import { MemberService } from '../../member/member.service';
import { RaidResult } from '../pvp.interfaces';
import { SHIELD_DURATION_IN_HOURS } from '../../game/pvp.constants';

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

    const description = [
      `:crossed_swords: You have been attacked by <@!${result.attacker}> :crossed_swords:\n\n`,
    ];
    if (result.success) {
      description.push(`You lost some resources:`);

      description.push(`${result.stolen.food} :food:`);
      description.push(
        `${result.stolen.buildingMaterials} :building_materials:`,
      );
      description.push(``);
      description.push(
        `:shield: You have been granted a ${SHIELD_DURATION_IN_HOURS} hours shield.`,
      );
      description.push(
        `*If you raid another player you will lose your shield*`,
      );
    } else {
      description.push(
        `:tada: You crushed the ennemy and won ${result.gold} :gold:`,
      );
    }

    embed.setDescription(description.join('\n'));

    member.send(embed);
  }
}
