import { Document } from 'mongoose';

export interface PvpShield {
  memberDiscordId: string;
  shieldStartingTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PvpShieldDocument extends PvpShield, Document {}
