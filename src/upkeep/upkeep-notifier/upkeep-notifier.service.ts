import { Injectable, Logger } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';

import { DiscordService } from '../../discord/discord.service';
import { MemberService } from '../../member/member.service';
import {
  TaxableProfile,
  TaxAmount,
  UpkeepTaxeCollectionResult,
} from '../upkeep.interfaces';

const debug = (message) => Logger.debug(message, 'UpkeepNotifier');
@Injectable()
export class UpkeepNotifierService {
  constructor(
    private readonly discord: DiscordService,
    private readonly memberService: MemberService,
  ) {}

  async notifyPlayer(
    profile: TaxableProfile,
    result: UpkeepTaxeCollectionResult,
  ): Promise<void> {
    if (!(await this.memberService.canNotify(profile.memberDiscordId))) return;
    const member = await this.discord.client.users.fetch(
      profile.memberDiscordId,
    );

    const description = this.formatPlayerDescription(result);
    const embed = new MessageEmbed()
      .setColor(result.success ? 'GREEN' : 'RED')
      .setTitle(
        result.success
          ? `Your upkeep have been paid`
          : `You failed to pay your upkeep cost`,
      )
      .setDescription(description)
      .setFooter("colonie notification will stop, if you don't play for 24h");

    await member.send(embed);
  }

  formatPlayerDescription(result: UpkeepTaxeCollectionResult): string {
    let description = `
** Upkeep Cost **
${result.paid.food} / ${result.colonieTaxes.food} :food:
${result.paid.buildingMaterials} / ${result.colonieTaxes.buildingMaterials} :building_materials:
${result.paid.gold} / ${result.colonieTaxes.gold} :gold:
`;
    if (!result.success) {
      const casualties = [];
      if (result.casualties.troops.guards)
        casualties.push(
          `${result.casualties.troops.guards} guards have left your service...`,
        );
      if (result.casualties.troops.lightInfantry)
        casualties.push(
          `${result.casualties.troops.lightInfantry} light infantry have deserted...`,
        );
      if (result.casualties.buildings.barraks)
        casualties.push(`Your barrak collapsed.`);
      description += `
**Since you can't pay you lost**
${casualties.join('\n')}
      `;
    }
    return description;
  }
}
