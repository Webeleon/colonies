import { Injectable, Logger } from '@nestjs/common';
import { VoteEventArgs } from 'dblapi.js';
import { MessageEmbed } from 'discord.js';

import { ResourcesService } from '../../resources/resources.service';
import { BuildingsService } from '../../buildings/buildings.service';
import { TroopsService } from '../../troops/troops.service';
import { MemberService } from '../../member/member.service';
import { DiscordService } from '../../discord/discord.service';
import {
  VOTE_BUILDING_MATERIALS_REWARD,
  VOTE_FOOD_REWARD,
  VOTE_GOLD_REWARD,
  VOTE_WEEKEND_MULTIPLIER,
  WEEKEND_VOTE_HOUSE_REWARD,
  WEEKEND_VOTE_LIGHT_INFANTRY_REWARD,
} from '../../game/vote.constants';
import { VoteRewards } from './topgg-vote-reward.interface';

@Injectable()
export class TopggVoteRewardService {
  constructor(
    private readonly discordService: DiscordService,
    private readonly memberService: MemberService,
    private readonly ressourcesService: ResourcesService,
    private readonly buildingsService: BuildingsService,
    private readonly troopsService: TroopsService,
  ) {}

  static computeReward(isWeekend: boolean): VoteRewards {
    const reward = (value: number) =>
      isWeekend ? value * VOTE_WEEKEND_MULTIPLIER : value;
    const rewards: VoteRewards = {
      food: reward(VOTE_FOOD_REWARD),
      buildingMaterials: reward(VOTE_BUILDING_MATERIALS_REWARD),
      gold: reward(VOTE_GOLD_REWARD),
    };

    if (isWeekend) {
      rewards.house = WEEKEND_VOTE_HOUSE_REWARD;
      rewards.lightInfantry = WEEKEND_VOTE_LIGHT_INFANTRY_REWARD;
    }
    return rewards;
  }

  async reward(voteEvent: VoteEventArgs): Promise<void> {
    Logger.log(voteEvent, 'top.gg reward service');

    const rewards = TopggVoteRewardService.computeReward(voteEvent.isWeekend);

    await this.ressourcesService.addFoodToMemberResources(
      voteEvent.user,
      rewards.food,
    );
    await this.ressourcesService.addBuildingMaterialsToMemberResources(
      voteEvent.user,
      rewards.buildingMaterials,
    );
    await this.ressourcesService.addGold(voteEvent.user, rewards.gold);

    if (voteEvent.isWeekend) {
      const troops = await this.troopsService.getMemberTroops(voteEvent.user);
      troops.lightInfantry += rewards.lightInfantry;
      await troops.save();

      const buildings = await this.buildingsService.getBuildingsForMember(
        voteEvent.user,
      );
      buildings.houses += rewards.house;
      await buildings.save();
    }

    await this.notify(voteEvent.user, voteEvent.isWeekend, rewards);
  }

  async notify(
    memberDiscordId: string,
    isWeekend: boolean,
    reward: VoteRewards,
  ): Promise<void> {
    if (!(await this.memberService.canNotify(memberDiscordId))) return;

    const member = await this.discordService.client.users.fetch(
      memberDiscordId,
    );
    const weekendBonus = isWeekend
      ? `:tada::tada::tada: Weekend Bonus :tada::tada::tada:
:house: ${reward.house} house :house:
:ninja: ${reward.lightInfantry} light infantry :ninja:
      `
      : '';
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Thanks for voting!').setDescription(`
You have been rewarded:
:apple: ${reward.food} food :apple:
:bricks: ${reward.buildingMaterials} building materials :bricks:
:moneybag: ${reward.gold} gold :moneybag:

${weekendBonus}
        `);

    await member.send(embed);
  }
}
