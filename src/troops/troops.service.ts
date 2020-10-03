import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TroopsDocument } from './troops.interface';
import { ResourcesService } from '../resources/resources.service';
import { GATHERER_CREATION_FOOD_COST } from './troops.constants';

@Injectable()
export class TroopsService {
  constructor(
    @InjectModel('Troops')  private readonly TroopsModel: Model<TroopsDocument>,
    private readonly resourcesService: ResourcesService,
  ) {}

  async getMemberTroops(memberDiscordId: string): Promise<TroopsDocument> {
    const memberTroops = await this.TroopsModel.findOne({ memberDiscordId });
    if (!memberTroops) {
      return this.TroopsModel.create({
          memberDiscordId,
          gatherers: 0,
      });
    }
    return memberTroops;
  }

  async recruitGatherer(memberDiscordId: string): Promise<void> {
    await this.resourcesService.consumeFood(memberDiscordId, GATHERER_CREATION_FOOD_COST);
    const troops = await this.getMemberTroops(memberDiscordId);
    // TODO: test if troop limit is ok when buildings are ok
    troops.gatherers += 1;
    await troops.save();
  }
}
