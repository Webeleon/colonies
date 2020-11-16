export interface RaidResult {
  attacker: string;
  defender: string;
  success: boolean;
  stolen?: RaidLoot;
  casualties?: RaidCasualties;
  gold: number;
}

export interface RaidCasualties {
  lightInfantry: number;
}

export interface RaidLoot {
  food: number;
  buildingMaterials: number;
}
