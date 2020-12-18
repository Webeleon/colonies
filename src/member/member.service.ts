import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryCursor } from 'mongoose';
import * as moment from 'moment';

import { IMemberDocument } from './member.interface';

interface MarkWorkParams {
  memberDiscordId?: string;
  member: IMemberDocument;
}

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private memberModel: Model<IMemberDocument>,
  ) {}

  async getMember(memberDiscordId: string): Promise<IMemberDocument> {
    const member = await this.memberModel.findOne({
      memberDiscordId,
    });
    if (!member) {
      return this.memberModel.create({
        memberDiscordId,
      });
    }
    return member;
  }

  async getMembersCursor(): Promise<QueryCursor<IMemberDocument>> {
    return this.memberModel.find({}).cursor();
  }

  async canNotify(memberDiscorId): Promise<boolean> {
    const member = await this.getMember(memberDiscorId);

    return !!(
      member.lastInteraction &&
      moment(member.lastInteraction) > moment().subtract(1, 'days')
    );
  }

  async markWork(params: MarkWorkParams): Promise<void> {
    let member: IMemberDocument;
    if (params.member) {
      member = params.member;
    } else if (params.memberDiscordId) {
      member = await this.getMember(params.memberDiscordId);
    } else {
      throw new Error('A member is required to ,ark work');
    }

    member.lastWork = new Date();
    await member.save();
  }

  async markInteraction(memberDiscordId: string): Promise<void> {
    const member = await this.getMember(memberDiscordId);
    member.lastInteraction = new Date();
    await member.save();
  }
}
