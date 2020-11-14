import { Injectable } from '@nestjs/common';
import { ITroops } from '../../troops/troops.interface';
import { TaxableProfile, TaxAmount } from '../upkeep.interfaces';
import {
  GUARD_DAILY_UPKEEP,
  LIGHT_INFANTRY_DAILY_FOOD_UPKEEP,
  LIGHT_INFANTRY_DAILY_GOLD_UPKEEP,
} from '../../game/troops.constants';
import { IBuilding } from '../../buildings/buildings.interfaces';
import { BARRAKS_DAILY_UPKEEP } from '../../game/buildings.constants';
import { TroopsService } from '../../troops/troops.service';
import { BuildingsService } from '../../buildings/buildings.service';

@Injectable()
export class UpkeepTaxesService {
  constructor(
    private readonly troopsService: TroopsService,
    private readonly buildingsService: BuildingsService,
  ) {}

  computeTroopTax(troops: ITroops): TaxAmount {
    return {
      food:
        troops.guards * GUARD_DAILY_UPKEEP +
        troops.lightInfantry * LIGHT_INFANTRY_DAILY_FOOD_UPKEEP,
      buildingMaterials: 0,
      gold: troops.lightInfantry * LIGHT_INFANTRY_DAILY_GOLD_UPKEEP,
    };
  }

  computeBuildingsTax(buildings: IBuilding): TaxAmount {
    return {
      food: 0,
      buildingMaterials: buildings.barraks * BARRAKS_DAILY_UPKEEP,
      gold: 0,
    };
  }

  async getTaxableProfiles(): Promise<TaxableProfile[]> {
    const troops = await this.troopsService.getAllUpkeepableTroopsProfiles();
    const buildings = await this.buildingsService.getAllUpkeepableBuildings();
    return this.mergeTroopsAndBuildings(troops, buildings);
  }

  mergeTroopsAndBuildings(
    troops: ITroops[],
    buildings: IBuilding[],
  ): TaxableProfile[] {
    const profilesMap = new Map<string, TaxableProfile>();

    for (const troop of troops) {
      profilesMap.set(troop.memberDiscordId, {
        memberDiscordId: troop.memberDiscordId,
        troops: troop,
      });
    }

    for (const building of buildings) {
      const profile = profilesMap.get(building.memberDiscordId);
      if (profile) profile.buildings = building;
      else
        profilesMap.set(building.memberDiscordId, {
          memberDiscordId: building.memberDiscordId,
          buildings: building,
        });
    }

    return Array.from(profilesMap.values());
  }
}
