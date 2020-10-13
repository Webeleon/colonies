import { Schema } from 'mongoose';

export const BuildingSchema = new Schema(
  {
    memberDiscordId: String,
    homes: {
      type: Number,
      default: 1,
    },
    farms: {
      type: Number,
      default: 0,
    },
    landfills: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
