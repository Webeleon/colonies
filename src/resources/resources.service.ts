import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResourcesDocument } from './resources.interface';
import {
  INITIAL_BUILDING_MATERIAL_SUPPLY,
  INITIAL_FOOD_SUPPLY,
} from './resources.constants';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel('Resources')
    private readonly ResourcesModel: Model<ResourcesDocument>,
  ) {}

  async getResourcesForMember(
    memberDiscordId: string,
  ): Promise<ResourcesDocument> {
    const memberResources = await this.ResourcesModel.findOne({
      memberDiscordId,
    });

    if (!memberResources) {
      return this.ResourcesModel.create({
        memberDiscordId,
        food: INITIAL_FOOD_SUPPLY,
        buildingMaterials: INITIAL_BUILDING_MATERIAL_SUPPLY,
      });
    }

    return memberResources;
  }

  async addFoodToMemberResources(
    memberDiscordId: string,
    foodSupplyToAdd: number,
  ): Promise<void> {
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    memberResources.food += foodSupplyToAdd;
    await memberResources.save();
  }

  async consumeFood(
    memberDiscordId: string,
    foodToConsume: number,
  ): Promise<void> {
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    if (memberResources.food < foodToConsume) {
      // TODO: create real error and error management system with i18n message and serializable codes
      throw new Error('insufficient food');
    }

    memberResources.food -= foodToConsume;
    await memberResources.save();
  }

  async addBuildingMaterialsToMemberResources(
    memberDiscordId: string,
    buildingMaterialsToAdd: number,
  ): Promise<void> {
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    memberResources.buildingMaterials += buildingMaterialsToAdd;
    await memberResources.save();
  }

  async consumeBuildingMaterials(
    memberDiscordId: string,
    buildingMaterialToConsumme: number,
  ): Promise<void> {
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    if (memberResources.buildingMaterials < buildingMaterialToConsumme) {
      throw new Error('insufficient building materials');
    }
    memberResources.buildingMaterials -= buildingMaterialToConsumme;
    await memberResources.save();
  }
}
