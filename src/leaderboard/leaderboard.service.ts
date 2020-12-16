import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LeaderBoard,
  LeaderboardDocument,
  LEADERBOARD_MODEL_NAME,
} from './leaderboard.model';

export enum leaderboardTopics {
  PVP = 'pvp',
  BUILDINGS = 'buildings',
  TROOPS = 'troops',
  RESOURCES = 'resources',
  TOTAL = 'total',
}

const COUNT = 10;

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

  async globalTop(topic: leaderboardTopics): Promise<LeaderBoard[]> {
    return this.leaderboardModel
      .find({})
      .sort({ [this.topicToDbField(topic)]: -1 })
      .limit(COUNT);
  }

  async serverTop(
    serverId: string,
    topic: leaderboardTopics,
  ): Promise<LeaderBoard[]> {
    return this.leaderboardModel
      .find({
        servers: {
          $in: [serverId],
        },
      })
      .sort({ [this.topicToDbField(topic)]: -1 })
      .limit(COUNT);
  }

  topicToDbField(topic: leaderboardTopics): string {
    return {
      [leaderboardTopics.PVP]: 'pvpScore',
      [leaderboardTopics.BUILDINGS]: 'buildingScore',
      [leaderboardTopics.TROOPS]: 'troopsScore',
      [leaderboardTopics.RESOURCES]: 'ressourcesScore',
      [leaderboardTopics.TOTAL]: 'score',
    }[topic];
  }
}
