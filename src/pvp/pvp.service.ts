import { Injectable } from '@nestjs/common';
import { RaidResult } from './pvp.interfaces';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { GOLD_PER_BATTLES } from '../game/pvp.constants';

@Injectable()
export class PvpService {
  constructor(
    private readonly pvpComputer: PvpComputerService,
    private readonly pvpNotifier: PvpNotifierService,
  ) {}

  async raid(
    attackerDiscordId: string,
    defenderDiscordId: string,
  ): Promise<RaidResult> {
    const attack = await this.pvpComputer.computeAttackPower(attackerDiscordId);
    const defense = await this.pvpComputer.computeDefensePower(
      defenderDiscordId,
    );

    const result: RaidResult = {
      attacker: attackerDiscordId,
      defender: defenderDiscordId,
      success: attack > defense,
      gold: GOLD_PER_BATTLES,
    };

    if (attack <= defense) {
      result.casualties = await this.pvpComputer.computeCasualties(
        attackerDiscordId,
        attack,
        defense,
      );
    } else {
      result.stolen = await this.pvpComputer.computeLoot(
        attackerDiscordId,
        defenderDiscordId,
      );
    }

    await this.pvpNotifier.notifyVictim(result);

    return result;
  }
}
