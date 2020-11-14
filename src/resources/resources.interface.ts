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

export enum RESOURCES_TYPE {
  FOOD = 'food',
  GOLD = 'gold',
  BUILDING_MATERIALS = 'building materials',
}
