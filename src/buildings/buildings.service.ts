import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BuildingDocument } from './buildings.interfaces';
import {
  FARMS_CONSTRUCTION_COST,
  FARMS_DEFAULT,
  HOME_CONSTRUCTION_COST,
  HOME_DEFAULT,
  LANDFILLS_CONSTRUCTION_COST,
  LANDFILLS_DEFAULT,
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

  // GET or create building for member
  async getBuildingsForMember(memberDiscordId): Promise<BuildingDocument> {
    const memberBuildings = await this.buildingModel.findOne({
      memberDiscordId,
    });
    if (!memberBuildings) {
      return this.buildingModel.create({
        memberDiscordId,
        homes: HOME_DEFAULT,
        farms: FARMS_DEFAULT,
        landfills: LANDFILLS_DEFAULT,
      });
    }
    return memberBuildings;
  }

  async buildHome(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      HOME_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.homes += 1;
    await memberBuildings.save();
  }
  // TODO: destroyHome

  async buildFarm(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      FARMS_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.farms += 1;
    await memberBuildings.save();
  }
  // TODO: destroyFarm

  async buildLandfills(memberDiscordId: string): Promise<void> {
    await this.resourceService.consumeBuildingMaterials(
      memberDiscordId,
      LANDFILLS_CONSTRUCTION_COST,
    );
    const memberBuildings = await this.getBuildingsForMember(memberDiscordId);
    memberBuildings.landfills += 1;
    await memberBuildings.save();
  }
  // TODO: destroy landfill
}
