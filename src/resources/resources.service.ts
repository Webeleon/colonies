import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResourcesDocument } from './resources.interface';
import {
  INITIAL_BUILDING_MATERIAL_SUPPLY,
  INITIAL_FOOD_SUPPLY,
  INITIAL_GOLD_SUPPLY,
} from '../game/resources.constants';
import { InsufficientBalanceError } from './resources.errors';

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
        gold: INITIAL_GOLD_SUPPLY,
      });
    }

    return memberResources;
  }

  async addFoodToMemberResources(
    memberDiscordId: string,
    amount: number,
  ): Promise<void> {
    this.positiveAmountGuard(amount);
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    memberResources.food += amount;
    await memberResources.save();
  }

  async consumeFood(memberDiscordId: string, amount: number): Promise<void> {
    this.positiveAmountGuard(amount);
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    if (memberResources.food < amount) {
      // TODO: create real error and error management system with i18n message and serializable codes
      throw new InsufficientBalanceError(
        'insuficient food',
        amount - memberResources.food,
      );
    }

    memberResources.food -= amount;
    await memberResources.save();
  }

  async addBuildingMaterialsToMemberResources(
    memberDiscordId: string,
    amount: number,
  ): Promise<void> {
    this.positiveAmountGuard(amount);
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    memberResources.buildingMaterials += amount;
    await memberResources.save();
  }

  async consumeBuildingMaterials(
    memberDiscordId: string,
    amount: number,
  ): Promise<void> {
    this.positiveAmountGuard(amount);
    const memberResources = await this.getResourcesForMember(memberDiscordId);
    if (memberResources.buildingMaterials < amount) {
      throw new InsufficientBalanceError(
        'insuficient building materials',
        amount - memberResources.buildingMaterials,
      );
    }
    memberResources.buildingMaterials -= amount;
    await memberResources.save();
  }

  async addGold(memberDiscordId: string, amount: number): Promise<void> {
    this.positiveAmountGuard(amount);
    const member = await this.getResourcesForMember(memberDiscordId);
    member.gold += amount;
    await member.save();
  }

  async consumeGold(memberDiscordId: string, amount: number): Promise<void> {
    this.positiveAmountGuard(amount);
    const member = await this.getResourcesForMember(memberDiscordId);
    if (member.gold < amount) {
      throw new InsufficientBalanceError(
        `not enough gold`,
        amount - member.gold,
      );
    }
    member.gold -= amount;
    await member.save();
  }

  // async availablePerventageOfResource(memberDiscordId: string, type: ResourcesDocument, amount: number): number {
  //   this.positiveAmountGuard(amount);
  //   const memberResources = await this.getResourcesForMember(memberDiscordId);
  //   let
  // }

  positiveAmountGuard(amount): void {
    if (amount < 0) throw new Error(`${amount} is not a positive amount!`);
  }
}
