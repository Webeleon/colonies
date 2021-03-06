import { Injectable } from '@nestjs/common';
import { RaidResult } from './pvp.interfaces';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { GOLD_PER_BATTLES } from '../game/pvp.constants';
import { PvpShieldService } from './pvp-shield/pvp-shield.service';

@Injectable()
export class PvpService {
  constructor(
    private readonly pvpComputer: PvpComputerService,
    private readonly pvpNotifier: PvpNotifierService,
    private readonly pvpShield: PvpShieldService,
  ) {}

  async raid(
    attackerDiscordId: string,
    defenderDiscordId: string,
  ): Promise<RaidResult> {
    const attack = await this.pvpComputer.computeAttackPower(attackerDiscordId);

    if (attack === 0) {
      throw new Error(
        `You do not have any troops to launch an attack:exclamation:`,
      );
    }

    if (await this.pvpShield.isShielded(defenderDiscordId)) {
      throw new Error(
        `The victim is shielded and can be attacked ${await this.pvpShield.shieldDurationString(
          defenderDiscordId,
        )}`,
      );
    }
    await this.pvpShield.dropShield(attackerDiscordId);

    const defense = await this.pvpComputer.computeDefensePower(
      defenderDiscordId,
    );

    const result: RaidResult = {
      attacker: attackerDiscordId,
      attack,
      defender: defenderDiscordId,
      defense,
      success: attack > defense,
    };

    result.casualties = await this.pvpComputer.computeCasualties(
      attackerDiscordId,
      attack,
      defense,
    );

    if (attack >= defense) {
      result.stolen = await this.pvpComputer.computeLoot(
        attackerDiscordId,
        defenderDiscordId,
      );
      await this.pvpShield.applyShield(defenderDiscordId);
    }

    result.gold = await this.pvpComputer.computeGold(result);
    await this.pvpNotifier.notifyVictim(result);

    return result;
  }
}
