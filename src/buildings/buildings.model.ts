import { Schema } from 'mongoose';

export const BuildingSchema = new Schema(
  {
    memberDiscordId: String,
    houses: {
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
    pitTrap: {
      type: Number,
      default: 0,
    },
    barraks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
