import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';

import { MemberService } from '../member/member.service';
import { WORK_LIMIT_IN_MINUTES } from './limits.constants';

@Injectable()
export class GameService {
  constructor(private readonly memberService: MemberService) {}

  async workLimitGuard(memberDiscordId: string): Promise<void> {
    const member = await this.memberService.getMember(memberDiscordId);
    Logger.debug(member);
    if (!member.lastWork) {
      await this.memberService.markWork({ member });
      return;
    }
    const canWork = moment(member.lastWork).add(
      WORK_LIMIT_IN_MINUTES,
      'minutes',
    );
    if (moment().isBefore(canWork)) {
      throw new Error(
        `Workers are getting some rest. retry ${canWork.fromNow()}.`,
      );
    }
    await this.memberService.markWork({ member });
  }
}
