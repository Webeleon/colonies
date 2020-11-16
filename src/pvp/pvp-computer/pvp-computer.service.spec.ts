import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { PvpComputerService } from './pvp-computer.service';
import { rootMongooseTestModule } from '../../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import { ResourcesModule } from '../../resources/resources.module';
import { ResourcesService } from '../../resources/resources.service';
import { RaidResult } from '../pvp.interfaces';
import { GOLD_PER_BATTLES } from '../../game/pvp.constants';

describe('PvpComputerService', () => {
  let pvpComputerService: PvpComputerService;
  let testModule: TestingModule;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        TroopsModule,
        BuildingsModule,
        ResourcesModule,
      ],
      providers: [PvpComputerService],
    }).compile();

    pvpComputerService = testModule.get<PvpComputerService>(PvpComputerService);
  });

  it('should be defined', () => {
    expect(pvpComputerService).toBeDefined();
  });

  describe('compute and remove gold', () => {
    const sandbox = sinon.createSandbox();
    let resourceService: ResourcesService;

    beforeEach(async () => {
      resourceService = testModule.get<ResourcesService>(ResourcesService);
      sinon.stub(resourceService, 'addGold');
    });
    afterEach(async () => {
      sandbox.reset();
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
});
