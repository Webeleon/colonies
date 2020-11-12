import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TROOP_TYPE, TroopsDocument } from './troops.interface';
import { ResourcesService } from '../resources/resources.service';
import {
  GATHERER_CREATION_FOOD_COST,
  GUARD_FOOD_COST,
  SCAVENGER_FOOD_COST,
} from '../game/troops.constants';

@Injectable()
export class TroopsService {
  constructor(
    @InjectModel('Troops') private readonly TroopsModel: Model<TroopsDocument>,
    private readonly resourcesService: ResourcesService,
  ) {}

  async getMemberTroops(memberDiscordId: string): Promise<TroopsDocument> {
    const memberTroops = await this.TroopsModel.findOne({ memberDiscordId });
    if (!memberTroops) {
      return this.TroopsModel.create({
        memberDiscordId,
        gatherers: 1,
        scavengers: 0,
        guards: 0,
      });
    }

    if (memberTroops.gatherers === 0) {
      // always grant a free gatherer
      memberTroops.gatherers = 1;
      await memberTroops.save();
    }

    return memberTroops;
  }

  async getTroopsCount(memberDiscordId: string): Promise<number> {
    const { scavengers, gatherers } = await this.getMemberTroops(
      memberDiscordId,
    );
    return (gatherers ?? 0) + (scavengers ?? 0);
  }

  async recruitGatherer(memberDiscordId: string): Promise<void> {
    await this.resourcesService.consumeFood(
      memberDiscordId,
      GATHERER_CREATION_FOOD_COST,
    );
    const troops = await this.getMemberTroops(memberDiscordId);
    // TODO: test if troop limit is ok when buildings are ok
    troops.gatherers += 1;
    await troops.save();
  }

  async recruitScavenger(memberDiscordId: string): Promise<void> {
    await this.resourcesService.consumeFood(
      memberDiscordId,
      SCAVENGER_FOOD_COST,
    );
    const troops = await this.getMemberTroops(memberDiscordId);
    troops.scavengers += 1;

    await troops.save();
  }

  async recruitGuard(memberDiscordId: string): Promise<void> {
    await this.resourcesService.consumeFood(memberDiscordId, GUARD_FOOD_COST);

    const troops = await this.getMemberTroops(memberDiscordId);
    troops.guards += 1;

    await troops.save();
  }

  async dismissTroop(
    memberDiscordId: string,
    troopType: TROOP_TYPE,
    amount = 1,
  ): Promise<void> {
    const memberTroops = await this.getMemberTroops(memberDiscordId);

    switch (troopType) {
      case TROOP_TYPE.GATHERER:
        const newGatherersCount = memberTroops.gatherers - amount;
        memberTroops.gatherers = newGatherersCount >= 1 ? newGatherersCount : 1;
        break;
      case TROOP_TYPE.SCAVENGER:
        const newScavengerCount = memberTroops.scavengers - amount;
        memberTroops.scavengers =
          newScavengerCount >= 0 ? newScavengerCount : 0;
        break;
    }

    await memberTroops.save();
  }
}
