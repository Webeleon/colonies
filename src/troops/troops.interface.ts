import { Document } from 'mongoose';

export interface ITroops {
  memberDiscordId: string;
  gatherers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TroopsDocument extends ITroops, Document {};
