import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { PvpComputerService } from './pvp-computer.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import { ResourcesModule } from '../../resources/resources.module';
import { ResourcesService } from '../../resources/resources.service';
import { RaidResult } from '../pvp.interfaces';
import { GOLD_PER_BATTLES } from '../../game/pvp.constants';
import { TroopsService } from '../../troops/troops.service';
import { TROOP_TYPE } from '../../troops/troops.interface';

describe('PvpComputerService', () => {
  let pvpComputerService: PvpComputerService;
  let testModule: TestingModule;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('pvp computer service'),
        TroopsModule,
        BuildingsModule,
        ResourcesModule,
      ],
      providers: [PvpComputerService],
    }).compile();

    pvpComputerService = testModule.get<PvpComputerService>(PvpComputerService);
  });

  afterEach(async () => {
    await closeInMongodConnection('pvp computer service');
  });

  it('should be defined', () => {
    expect(pvpComputerService).toBeDefined();
  });

  describe('compute and remove gold', () => {
    let resourceService: ResourcesService;

    beforeEach(async () => {
      resourceService = testModule.get<ResourcesService>(ResourcesService);
      sinon.stub(resourceService, 'addGold');
    });

    it('attacker succeed against defenseless player', async () => {
      const result: RaidResult = {
        success: true,
        attacker: 'winner',
        attack: 10,
        defender: 'loser',
        defense: 0,
      };

      const gold = await pvpComputerService.computeGold(result);
      expect(gold).toEqual(GOLD_PER_BATTLES);
      expect((resourceService.addGold as sinon.SinonStub).callCount).toEqual(1);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[0],
      ).toEqual(result.attacker);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[1],
      ).toEqual(gold);
    });

    it('attacker succeed against player with defenses', async () => {
      const result: RaidResult = {
        success: true,
        attacker: 'winner',
        attack: 10,
        defender: 'loser',
        defense: 5,
      };

      const gold = await pvpComputerService.computeGold(result);
      expect(gold).toEqual(
        Math.round(GOLD_PER_BATTLES + GOLD_PER_BATTLES * result.defense),
      );
      expect((resourceService.addGold as sinon.SinonStub).callCount).toEqual(1);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[0],
      ).toEqual(result.attacker);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[1],
      ).toEqual(gold);
    });

    it('attacker fail the raid against powerfull defense', async () => {
      const result: RaidResult = {
        success: false,
        attacker: 'loser',
        attack: 5,
        defender: 'loser',
        defense: 10,
      };

      const gold = await pvpComputerService.computeGold(result);
      expect(gold).toEqual(
        Math.round(GOLD_PER_BATTLES + GOLD_PER_BATTLES * result.defense),
      );
      expect((resourceService.addGold as sinon.SinonStub).callCount).toEqual(1);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[0],
      ).toEqual(result.defender);
      expect(
        (resourceService.addGold as sinon.SinonStub).getCall(0).args[1],
      ).toEqual(gold);
    });
  });

  describe('compute and remove casaualties', () => {
    let troopsService: TroopsService;
    const ATTACKER_ID = 'attacker';
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
      troopsService = testModule.get<TroopsService>(TroopsService);
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('[attacker win] kill one unit of the attacker per defense point', async () => {
      const dismissStub = sandbox.stub(troopsService, 'dismissTroop');
      sandbox.stub(troopsService, 'getMemberTroops').returns({
        lightInfantry: 15,
      } as any);

      const casualties = await pvpComputerService.computeCasualties(
        ATTACKER_ID,
        15,
        5,
      );

      expect(casualties.lightInfantry).toEqual(5);
      expect(dismissStub.getCall(0).args[2]).toEqual(5);
    });

    it('[defender win] kill all the troops', async () => {
      const dismissStub = sandbox.stub(troopsService, 'dismissTroop');
      sandbox.stub(troopsService, 'getMemberTroops').returns(
        Promise.resolve({
          memberDiscordId: ATTACKER_ID,
          lightInfantry: 10,
        } as any),
      );

      const casualties = await pvpComputerService.computeCasualties(
        ATTACKER_ID,
        10,
        15,
      );

      expect(casualties.lightInfantry).toEqual(10);

      // order sent to the troop service
      expect(dismissStub.getCall(0).args[0]).toEqual(ATTACKER_ID);
      expect(dismissStub.getCall(0).args[1]).toEqual(TROOP_TYPE.LIGHT_INFANTRY);
      expect(dismissStub.getCall(0).args[2]).toEqual(10);
    });
  });
});
