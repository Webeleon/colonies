import { Document } from 'mongoose';

export interface IBuilding {
  memberDiscordId: string;
  // housing
  houses: number;

  // production
  farms: number;
  landfills: number;

  // war
  pitTrap: number;
  barraks: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface BuildingDocument extends IBuilding, Document {}
