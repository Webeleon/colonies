export interface RaidResult {
  attacker: string;
  attack: number;
  defender: string;
  defense: number;
  success: boolean;
  stolen?: RaidLoot;
  casualties?: RaidCasualties;
  gold?: number;
}

export interface RaidCasualties {
  lightInfantry: number;
}

export interface RaidLoot {
  food: number;
  buildingMaterials: number;
}
