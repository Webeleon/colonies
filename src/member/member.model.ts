import * as mongoose from 'mongoose';

export const memberSchema = new mongoose.Schema(
  {
    memberDiscordId: String,
    lastWork: Date,
    lastInteraction: Date,
  },
  {
    timestamps: true,
  },
);
