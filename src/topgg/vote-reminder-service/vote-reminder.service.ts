import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import {
  VOTE_REMINDER_MODEL_NAME,
  VoteReminder,
  VoteReminderDocument,
} from './vote-reminder.model';

@Injectable()
export class VoteReminderService {
  constructor(
    @InjectModel(VOTE_REMINDER_MODEL_NAME)
    private readonly VoteReminderModel: Model<VoteReminderDocument>,
  ) {}

  async getVoteReminder(memberDiscordId): Promise<VoteReminderDocument> {
    const voteReminder = await this.VoteReminderModel.findOne({
      memberDiscordId,
    });

    if (!voteReminder)
      return this.VoteReminderModel.create({
        memberDiscordId,
        subscribed: false,
        notified: false,
        voteCount: 0,
      });

    return voteReminder;
  }
  async subscribe(memberDiscordId: string): Promise<void> {
    const voteReminder = await this.getVoteReminder(memberDiscordId);
    voteReminder.subscribed = true;
    await voteReminder.save();
  }

  async unsubscribe(memberDiscordId: string): Promise<void> {
    const voteReminder = await this.getVoteReminder(memberDiscordId);
    voteReminder.subscribed = false;
    await voteReminder.save();
  }

  async getSubsToNotify(): Promise<VoteReminder[]> {
    return this.VoteReminderModel.find({
      subscribed: true,
      notified: false,
      lastVote: {
        $lt: moment().subtract(12, 'hours').toDate(),
      },
    });
  }

  async markAsNotified(memberDiscordId: string): Promise<void> {
    const voteReminder = await this.getVoteReminder(memberDiscordId);
    voteReminder.notified = true;
    await voteReminder.save();
  }

  async markVote(memberDiscordId: string): Promise<void> {
    const voteReminder = await this.getVoteReminder(memberDiscordId);
    voteReminder.lastVote = new Date();
    voteReminder.voteCount += 1;
    voteReminder.notified = false;
    await voteReminder.save();
  }
}
