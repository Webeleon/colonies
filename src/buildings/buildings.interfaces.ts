import { Document } from 'mongoose';

export interface IBuilding {
  memberDiscordId: string;
  houses: number;
  farms: number;
  landfills: number;
  pitTrap: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BuildingDocument extends IBuilding, Document {}
