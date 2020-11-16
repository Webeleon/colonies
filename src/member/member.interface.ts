import { Document } from 'mongoose';

export interface IMember {
  memberDiscordId: string;
  lastWork?: Date;
  lastInteraction?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMemberDocument extends IMember, Document {}
