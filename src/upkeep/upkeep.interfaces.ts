import { ITroops } from '../troops/troops.interface';
import { IBuilding } from '../buildings/buildings.interfaces';

export interface TaxableProfile {
  memberDiscordId: string;
  troops?: ITroops;
  buildings?: IBuilding;
}

export interface TaxAmount {
  food: number;
  buildingMaterials: number;
  gold: number;
}

export interface UpkeepTaxeCollectionResult {
  success: boolean;
  colonieTaxes: TaxAmount;
  paid: TaxAmount;
  casualties?: {
    troops?: {
      guards: number;
      lightInfantry: number;
    };
    buildings?: {
      barraks: number;
    };
  };
}
