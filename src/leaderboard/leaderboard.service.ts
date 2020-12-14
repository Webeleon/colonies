import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LeaderBoard,
  LeaderboardDocument,
  LEADERBOARD_MODEL_NAME,
} from './leaderboard.model';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(LEADERBOARD_MODEL_NAME)
    private readonly leaderboardModel: Model<LeaderboardDocument>,
  ) {}

  async getMemberLeaderboard(
    memberDiscordId: string,
  ): Promise<LeaderboardDocument> {
    const leaderboard = await this.leaderboardModel.findOne({
      memberDiscordId,
    });
    if (!leaderboard) return this.leaderboardModel.create({ memberDiscordId });
    return leaderboard;
  }

  async globalTop(count = 10): Promise<LeaderBoard[]> {
    throw new Error('NOT IMPLEMENTED');
  }

  async serverTop(count = 10): Promise<LeaderBoard> {
    throw new Error('NOT IMPLEMENTED');
  }
}
