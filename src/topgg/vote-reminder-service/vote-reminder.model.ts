import { Document, Schema } from 'mongoose';

export interface VoteReminder {
  memberDiscordId: string;
  subscribed: boolean;
  lastVote?: Date;
  notified: boolean;
  voteCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VoteReminderDocument extends VoteReminder, Document {}

export const VOTE_REMINDER_MODEL_NAME = 'VoteReminder';
export const VoteReminderSchema = new Schema({
  memberDiscordId: {
    type: String,
    unique: true,
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
  lastVote: {
    type: Date,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
});
