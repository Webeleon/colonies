import { Injectable, Logger } from '@nestjs/common';
import {
  GUARD_DEF,
  LIGHT_INFANTRY_ATK,
  LIGHT_INFANTRY_DEF,
} from '../../game/troops.constants';
import { PITTRAP_DEF } from '../../game/buildings.constants';
import { TroopsService } from '../../troops/troops.service';
import { BuildingsService } from '../../buildings/buildings.service';
import { RaidCasualties, RaidLoot, RaidResult } from '../pvp.interfaces';
import { ResourcesService } from '../../resources/resources.service';
import { TROOP_TYPE } from '../../troops/troops.interface';
import { GOLD_PER_BATTLES, LOOT_PERCENTAGE } from '../../game/pvp.constants';

@Injectable()
export class PvpComputerService {
  constructor(
    private readonly troopsService: TroopsService,
    private readonly buildingsService: BuildingsService,
    private readonly resourcesService: ResourcesService,
  ) {}

  async computeGold(result: RaidResult): Promise<number> {
    const gold = Math.round(
      GOLD_PER_BATTLES + GOLD_PER_BATTLES * result.defense,
    );

    await this.resourcesService.addGold(
      result.success ? result.attacker : result.defender,
      gold,
    );

    return gold;
  }

  async computeCasualties(
    attackerDiscordId: string,
    attack: number,
    defense: number,
  ): Promise<RaidCasualties> {
    const troops = await this.troopsService.getMemberTroops(attackerDiscordId);
    const atkToDef = attack - defense;

    const toDismiss =
      atkToDef <= 0 ? troops.lightInfantry : troops.lightInfantry - atkToDef;

    if (toDismiss) {
      await this.troopsService.dismissTroop(
        attackerDiscordId,
        TROOP_TYPE.LIGHT_INFANTRY,
        toDismiss,
      );
    }

    return {
      lightInfantry: toDismiss,
    };
  }

  async computeLoot(
    attackerDiscordId: string,
    defenderDiscordId: string,
  ): Promise<RaidLoot> {
    const resources = await this.resourcesService.getResourcesForMember(
      defenderDiscordId,
    );

    const loot: RaidLoot = {
      food: Math.floor(resources.food * (LOOT_PERCENTAGE / 100)),
      buildingMaterials: Math.floor(
        resources.buildingMaterials * (LOOT_PERCENTAGE / 100),
      ),
    };

    await this.resourcesService.consumeFood(defenderDiscordId, loot.food);
    await this.resourcesService.addFoodToMemberResources(
      attackerDiscordId,
      loot.food,
    );

    await this.resourcesService.consumeBuildingMaterials(
      defenderDiscordId,
      loot.buildingMaterials,
    );
    await this.resourcesService.addBuildingMaterialsToMemberResources(
      attackerDiscordId,
      loot.buildingMaterials,
    );

    return loot;
  }

  async computeAttackPower(memberDiscordId: string): Promise<number> {
    const troops = await this.troopsService.getMemberTroops(memberDiscordId);

    return troops.lightInfantry * LIGHT_INFANTRY_ATK;
  }

  async computeDefensePower(memberDiscordId: string): Promise<number> {
    const troops = await this.troopsService.getMemberTroops(memberDiscordId);
    const buildings = await this.buildingsService.getBuildingsForMember(
      memberDiscordId,
    );

    return (
      troops.guards * GUARD_DEF +
      troops.lightInfantry * LIGHT_INFANTRY_DEF +
      buildings.pitTrap * PITTRAP_DEF
    );
  }
}
