import * as mongoose from 'mongoose';

export const TroopsSchema = new mongoose.Schema({
  memberDiscordId: String,

  // production troops

  gatherers: {
    type: Number,
    default: 1,
  },
  scavengers: {
    type: Number,
    default: 0,
  },

  // war troops

  guards: {
    type: Number,
    default: 0,
  },
});
