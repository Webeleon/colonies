import { Document } from 'mongoose';

export interface ITroops {
  memberDiscordId: string;
  // production
  gatherers: number;
  scavengers: number;

  // war
  guards: number;
  lightInfantry: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface TroopsDocument extends ITroops, Document {}

export enum TROOP_TYPE {
  SCAVENGER = 'scavenger',
  GATHERER = 'gatherer',
  GUARD = 'guard',
  LIGHT_INFANTRY = 'light infantry',
}
