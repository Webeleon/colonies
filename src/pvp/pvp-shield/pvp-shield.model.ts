import { Schema } from 'mongoose';

export const PvpShieldSchema = new Schema(
  {
    memberDiscordId: {
      type: String,
      index: true,
      unique: true,
    },
    shieldStartingTime: Date,
  },
  {
    timestamps: true,
  },
);
