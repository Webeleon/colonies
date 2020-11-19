import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';

import { PvpShieldDocument } from './pvp-shield.interfaces';
import { SHIELD_DURATION_IN_HOURS } from '../../game/pvp.constants';

@Injectable()
export class PvpShieldService {
  constructor(
    @InjectModel('PvpShield')
    private readonly PvpShieldModel: Model<PvpShieldDocument>,
  ) {}

  async isShielded(memberDiscordId: string): Promise<boolean> {
    const shield = await this.PvpShieldModel.findOne({
      memberDiscordId,
    });

    return (
      shield &&
      moment(shield.shieldStartingTime).add(SHIELD_DURATION_IN_HOURS, 'hours') >
        moment()
    );
  }

  async applyShield(memberDiscordId: string): Promise<void> {
    await this.PvpShieldModel.updateOne(
      { memberDiscordId },
      {
        memberDiscordId,
        shieldStartingTime: new Date(),
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async dropShield(memberDiscordId: string): Promise<void> {
    await this.PvpShieldModel.deleteOne({ memberDiscordId });
  }
}
