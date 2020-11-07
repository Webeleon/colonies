import { Document } from 'mongoose';

export interface Resources {
  memberDiscordId: string;
  food: number;
  buildingMaterials: number;
  gold: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResourcesDocument extends Resources, Document {}
