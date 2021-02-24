import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BuildingsService } from '../../buildings/buildings.service';
import { DiscordService } from '../../discord/discord.service';
import { IMember } from '../../member/member.interface';
import { ResourcesService } from '../../resources/resources.service';
import { TroopsService } from '../../troops/troops.service';

import { MemberService } from '../../member/member.service';
import { LeaderboardService } from '../leaderboard.service';

@Injectable()
export class LeaderboardComputerService {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly memderService: MemberService,

    private readonly resourcesService: ResourcesService,
    private readonly buildingService: BuildingsService,
    private readonly troopsService: TroopsService,
    private readonly discordService: DiscordService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async execute() {
    Logger.log(`Starting leaderboard update`, 'LeaderboardComputerService');
    const membersCursor = await this.memderService.getMembersCursor();
    for await (const member of membersCursor) {
      try {
        await this.computeMemberLeaderboard(member);
      } catch (error) {
        Logger.error(
          `failed to update ${member.memberDiscordId} : ${error.message}`,
          error.stack,
        );
      }
    }
  }

  private async computeMemberLeaderboard(member: IMember): Promise<void> {
    const leaderboard = await this.leaderboardService.getMemberLeaderboard(
      member.memberDiscordId,
    );

    // resources
    const resources = await this.resourcesService.getResourcesForMember(
      member.memberDiscordId,
    );
    leaderboard.ressourcesScore =
      resources.gold + resources.food + resources.buildingMaterials;

    // buildings
    const buildings = await this.buildingService.getBuildingsForMember(
      member.memberDiscordId,
    );
    leaderboard.buildingScore =
      buildings.houses +
      buildings.barraks +
      buildings.landfills +
      buildings.farms +
      buildings.pitTrap;

    // troops
    const troopsCount = await this.troopsService.getTroopsCount(
      member.memberDiscordId,
    );
    leaderboard.troopsScore = troopsCount;

    // pvp
    const troops = await this.troopsService.getMemberTroops(
      member.memberDiscordId,
    );
    leaderboard.pvpScore =
      buildings.barraks +
      buildings.pitTrap +
      troops.guards +
      troops.lightInfantry;

    // total
    leaderboard.score =
      leaderboard.ressourcesScore +
      leaderboard.buildingScore +
      leaderboard.troopsScore +
      leaderboard.pvpScore;

    // discord infos
    try {
      const discord = this.discordService.client;
      const discordMember = await discord.users.cache.get(
        member.memberDiscordId,
      );

      if (!discordMember) {
        await leaderboard.delete();
        return;
      }

      leaderboard.username = discordMember.username;
      leaderboard.userAvatarUrl = discordMember.avatarURL();
    } catch (error) {
      Logger.error(error.message, error.stack);
    }

    await leaderboard.save();
  }
}
