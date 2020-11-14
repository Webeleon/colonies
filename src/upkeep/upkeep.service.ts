import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import {
  TaxableProfile,
  TaxAmount,
  UpkeepTaxeCollectionResult,
} from './upkeep.interfaces';
import { UpkeepNotifierService } from './upkeep-notifier/upkeep-notifier.service';
import { UpkeepTaxesService } from './upkeep-taxes/upkeep-taxes.service';
import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector/upkeep-taxes-collector.service';

const debug = (msg) => Logger.debug(msg, 'UpkeepScheduled');

const emptyTax: TaxAmount = {
  food: 0,
  buildingMaterials: 0,
  gold: 0,
};

@Injectable()
export class UpkeepService {
  constructor(
    private readonly notifier: UpkeepNotifierService,
    private readonly tax: UpkeepTaxesService,
    private readonly taxCollector: UpkeepTaxesCollectorService,
  ) {}

  @Cron('0 12 * * *')
  async scheduledTaxTask() {
    debug('Starting the upkeep');
    const profiles = await this.tax.getTaxableProfiles();
    debug(`found ${profiles.length} player that need to pay for upkeep`);

    for (const profile of profiles) {
      try {
        await this.taxAndNotify(profile);
      } catch (error) {
        Logger.error(
          error.message,
          error.stack,
          `${profile.memberDiscordId} upkeep`,
        );
      }
    }
  }

  async taxAndNotify(profile: TaxableProfile): Promise<void> {
    debug(profile);
    const { troops, buildings } = profile;

    const troopUpkeepCost = troops
      ? this.tax.computeTroopTax(troops)
      : emptyTax;
    const buildingUpkeepCost = buildings
      ? this.tax.computeBuildingsTax(buildings)
      : emptyTax;

    const result = await this.taxCollector.collect(
      profile,
      troopUpkeepCost,
      buildingUpkeepCost,
    );
    await this.notifier.notifyPlayer(profile, result);
  }
}
