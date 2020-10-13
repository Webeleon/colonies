import { Document } from 'mongoose';

export interface IBuilding {
  memberDiscordId: string;
  homes: number;
  farms: number;
  landfills: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingDocument extends IBuilding, Document {}
