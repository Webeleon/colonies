import { Injectable } from '@nestjs/common';
import { TroopsService } from '../troops/troops.service';
import { ResourcesService } from '../resources/resources.service';
import {
  IGatherersWorkReport,
  IScavengersWorkReports,
  IWorkReport,
} from './work.interfaces';
import { TroopsDocument } from '../troops/troops.interface';
import { ResourcesDocument } from '../resources/resources.interface';
import {
  GATHERER_WORK_FOOD_YIELD,
  SCAVENGER_BUILDING_MATERIAL_YIELD,
  SCAVENGER_FOOD_COST,
  SCAVENGER_WORK_COST,
} from '../troops/troops.constants';

interface IWorkContext {
  memberDiscordId: string;
  troops: TroopsDocument;
  resources: ResourcesDocument;
}

@Injectable()
export class WorkService {
  constructor(
    private readonly troopService: TroopsService,
    private readonly resourceService: ResourcesService,
  ) {}

  async startColonieWork(memberDiscordId: string): Promise<IWorkReport> {
    const context = {
      memberDiscordId,
      troops: await this.troopService.getMemberTroops(memberDiscordId),
      resources: await this.resourceService.getResourcesForMember(
        memberDiscordId,
      ),
    };
    return {
      gatherers: await this.startGatherersWork(context),
      scavengers: await this.startScavengersWork(context),
    };
  }

  private async startGatherersWork(
    context: IWorkContext,
  ): Promise<IGatherersWorkReport> {
    const foodProduced =
      (context.troops.gatherers ?? 0) * GATHERER_WORK_FOOD_YIELD;
    // TODO: use resourcesService methods instead!!
    context.resources.food += foodProduced;
    await context.resources.save();
    return {
      numberOfTroops: context.troops.gatherers,
      foodProduced,
    };
  }

  private async startScavengersWork(
    context: IWorkContext,
  ): Promise<IScavengersWorkReports> {
    const numberOfTroops = context.troops.scavengers ?? 0;
    const foodConsumed = numberOfTroops * SCAVENGER_WORK_COST;
    try {
      await this.resourceService.consumeFood(
        context.memberDiscordId,
        foodConsumed,
      );
      const buildingMaterialsProduced =
        numberOfTroops * SCAVENGER_BUILDING_MATERIAL_YIELD;
      // TODO: use resourceService methods instead!
      if (!context.resources.buildingMaterials) {
        context.resources.buildingMaterials = buildingMaterialsProduced;
      } else {
        context.resources.buildingMaterials += buildingMaterialsProduced;
      }
      await context.resources.save();
      return {
        numberOfTroops,
        foodConsumed,
        buildingMaterialsProduced,
      };
    } catch (error) {
      return {
        numberOfTroops,
        foodConsumed: 0,
        buildingMaterialsProduced: 0,
        error,
      };
    }
  }
}
