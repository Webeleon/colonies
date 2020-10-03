import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResourcesDocument } from './resources.interface';
import { INITIAL_FOOD_SUPPLY } from './resources.constants';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel('Resources') private readonly ResourcesModel: Model<ResourcesDocument>
  ) {}

  async getResourcesForMember(memberDiscordId: string): Promise<ResourcesDocument> {
    const memberResources = await this.ResourcesModel.findOne({
      memberDiscordId,
    });

    if (!memberResources) {
      return this.ResourcesModel.create({
        memberDiscordId,
        food: INITIAL_FOOD_SUPPLY,
      });
    }

    return memberResources;
  }

  async addFoodToMemberResources(memberDiscordId: string, foodSupplyToAdd: number): Promise<void> {
     const memberResources = await this.getResourcesForMember(memberDiscordId);
     memberResources.food += foodSupplyToAdd;
     await memberResources.save();
  }
}

