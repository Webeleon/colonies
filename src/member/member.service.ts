import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { IMemberDocument } from './member.interface';
import { ICommandHandler } from '../commands/ICommandHandler';

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
        lastInteraction: new Date(),
      });
    }
    return member;
  }

  async canNotify(memberDiscorId): Promise<boolean> {
    const member = await this.getMember(memberDiscorId);

    return (
      moment(member.lastInteraction ?? new Date()) <
      moment().subtract(1, 'days')
    );
  }

  async markWork(params: MarkWorkParams): Promise<void> {
    let member: IMemberDocument;
    if (params.member) {
      member = params.member;
    } else if (params.memberDiscordId) {
      member = await this.getMember(params.memberDiscordId);
    } else {
      throw new Error('A member is required to nark work');
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
