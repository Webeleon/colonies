import { Document, Schema } from 'mongoose';

export interface LeaderBoard {
  memberDiscordId: string;
  username?: string;
  userAvatarUrl?: string;
  pvpScore?: number;
  ressourcesScore?: number;
  buildingScore?: number;
  troopsScore?: number;
  score?: number;
  servers?: string[];
}

export interface LeaderboardDocument extends LeaderBoard, Document {}

export const LeaderBoardSchema = new Schema(
  {
    memberDiscordId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
    },
    userAvatarUrl: {
      type: String,
    },
    pvpScore: {
      type: Number,
      default: 0,
    },
    ressourcesScore: {
      type: Number,
      default: 0,
    },
    buildingScore: {
      type: Number,
      default: 0,
    },
    troopsScore: {
      type: Number,
      default: 1,
    },
    score: {
      type: Number,
      default: 0,
    },
    servers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const LEADERBOARD_MODEL_NAME = 'leaderboard';
