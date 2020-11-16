import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageEmbed } from 'discord.js';

import { BuildingsService } from '../buildings/buildings.service';
import { DiscordService } from '../discord/discord.service';
import { MemberService } from '../member/member.service';
import { IBuilding } from '../buildings/buildings.interfaces';
import { ResourcesService } from '../resources/resources.service';
import { FARMS_YIELD, LANDFILLS_YIELD } from '../game/buildings.constants';

const debug = (message) => Logger.debug(message, 'BuildingProductionService');

@Injectable()
export class BuildingsProductionsService {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly resourceService: ResourcesService,
    private readonly discordService: DiscordService,
    private readonly memberService: MemberService,
  ) {}

  @Cron('0 0,12 * * *')
  async massProduction(): Promise<void> {
    debug('Start building production');
    const allMembersProductionBuildingProfile = await this.buildingsService.getAllProductionBuildings();
    debug(`found ${allMembersProductionBuildingProfile.length} to produce`);
    for (const profile of allMembersProductionBuildingProfile) {
      try {
        await this.memberProduction(profile);
      } catch (error) {
        Logger.error(
          error.message,
          error.stack,
          `${profile.memberDiscordId} production`,
        );
      }
    }
  }

  async memberProduction(profile: IBuilding): Promise<void> {
    const discordMember = await this.discordService.client.users.fetch(
      profile.memberDiscordId,
    );

    if (!(await this.memberService.canNotify(profile.memberDiscordId))) return;

    const foodProduced = await this.farmProduction(profile);
    const buildingMaterialsProduced = await this.landfillProduction(profile);

    // TODO extract somewhere

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Your buildings produced some nice resources!')
      .addField('Farms', foodProduced)
      .addField('Landfills', buildingMaterialsProduced)
      .setFooter(
        'Colonie production has be done and notify since you played in the last 24h',
      );
    discordMember.send(embed);
  }

  async farmProduction(profile): Promise<number> {
    if (profile.farms === 0) return 0;
    const foodProduced = profile.farms * FARMS_YIELD;
    await this.resourceService.addFoodToMemberResources(
      profile.memberDiscordId,
      foodProduced,
    );
    return foodProduced;
  }

  async landfillProduction(profile: IBuilding): Promise<number> {
    if (profile.landfills === 0) return 0;
    const buildingMaterialsProduced = profile.landfills * LANDFILLS_YIELD;
    await this.resourceService.addBuildingMaterialsToMemberResources(
      profile.memberDiscordId,
      buildingMaterialsProduced,
    );
    return buildingMaterialsProduced;
  }
}
