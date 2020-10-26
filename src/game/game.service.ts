import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { MemberService } from '../member/member.service';
import { BuildingsService } from '../buildings/buildings.service';
import { TroopsService } from '../troops/troops.service';

import { HOME_ADDED_TROOPS } from './buildings.constants';
import { WORK_LIMIT_IN_MINUTES } from './limits.constants';

@Injectable()
export class GameService {
  constructor(
    private readonly memberService: MemberService,
    private readonly buildingService: BuildingsService,
    private readonly troopsService: TroopsService,
  ) {}

  async workLimitGuard(memberDiscordId: string): Promise<void> {
    const member = await this.memberService.getMember(memberDiscordId);
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

  async recruitmentGuard(memberDiscordId: string): Promise<void> {
    const buildings = await this.buildingService.getBuildingsForMember(memberDiscordId);
    const troopsCount = await this.troopsService.getTroopsCount(memberDiscordId);

    if (buildings.homes * HOME_ADDED_TROOPS <= troopsCount) {
      throw new Error(`Your ${buildings.homes} houses allow you to recruit ${buildings.homes * HOME_ADDED_TROOPS}. Build more homes to recruit more troops.`);
    }
  }
}
