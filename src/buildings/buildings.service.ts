import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BuildingDocument } from './buildings.interfaces';
import {
  BARRAKS_CONSTRUCTION_COST,
  BARRAKS_DEFAULT,
  FARMS_CONSTRUCTION_COST,
  FARMS_DEFAULT,
  HOUSE_CONSTRUCTION_COST,
  HOUSE_DEFAULT,
  LANDFILLS_CONSTRUCTION_COST,
  LANDFILLS_DEFAULT,
  PITTRAP_CONSTRUCTION_COST,
  PITTRAP_DEFAULT,
} from '../game/buildings.constants';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectModel('Buildings')
    private readonly buildingModel: Model<BuildingDocument>,
    private readonly resourceService: ResourcesService,
  ) {}

  async getAllProductionBuildings(): Promise<BuildingDocument[]> {
    return this.buildingModel.find().or([
      {
        farms: {
          $gt: 0,
        },
      },
      {
        landfills: {
          $gt: 0,
        },
      },
    ]);
  }

  async getAllUpkeepableBuildings(): Promise<BuildingDocument[]> {
    return this.buildingModel.find().or([
      {
        barraks: {
          $gt: 0,
        },
      },
    ]);
  }

  // GET or create building for member
  async getBuildingsForMember(memberDiscordId): Promise<BuildingDocument> {
    const memberBuildings = await this.buildingModel.findOne({
      memberDiscordId,
    });
    if (!memberBuildings) {
      return this.buildingModel.create({
        memberDiscordId,
        houses: HOUSE_DEFAULT,
        farms: FARMS_DEFAULT,
        landfills: LANDFILLS_DEFAULT,
        pitTrap: PITTRAP_DEFAULT,
        barraks: BARRAKS_DEFAULT,
      });
    }
    return memberBuildings;
  }

  async buildHouse(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      HOUSE_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.houses += 1;
    await memberBuildings.save();
  }

  async buildFarm(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      FARMS_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.farms += 1;
    await memberBuildings.save();
  }

  async buildLandfills(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      LANDFILLS_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.landfills += 1;
    await memberBuildings.save();
  }

  async buildPitTrap(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      PITTRAP_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.pitTrap += 1;
    await memberBuildings.save();
  }

  async buildBarrak(memberDiscordId: string): Promise<void> {
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    if (memberBuildings.barraks === 1) {
      throw new Error('Only one barak can be built!');
    }
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      BARRAKS_CONSTRUCTION_COST,
    );
    memberBuildings.barraks += 1;
    await memberBuildings.save();
  }

  async demolishBarrak(memberDiscordId: string): Promise<void> {
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.barraks = 0;
    await memberBuildings.save();
  }
}
