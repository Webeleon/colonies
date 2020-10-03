import * as mongoose from 'mongoose';

export const ResourcesSchema = new mongoose.Schema({
  memberDiscordId: String,
  food: Number,
}, { timestamps: true });
