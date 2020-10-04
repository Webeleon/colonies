import * as mongoose from 'mongoose';

export const TroopsSchema = new mongoose.Schema({
  memberDiscordId: String,
  gatherers: Number,
  scavengers: Number,
});
