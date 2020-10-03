import { Document } from 'mongoose';

export interface Resources {
  memberDiscordId: string;
  food: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourcesDocument extends Resources, Document {}
