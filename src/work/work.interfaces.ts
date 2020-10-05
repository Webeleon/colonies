export interface IGatherersWorkReport {
  numberOfTroops: number;
  foodProduced: number;
}
export interface IScavengersWorkReports {
  numberOfTroops: number;
  foodConsumed: number;
  buildingMaterialsProduced: number;
  error?: Error;
}

export interface IWorkReport {
  gatherers: IGatherersWorkReport;
  scavengers: IScavengersWorkReports;
}
