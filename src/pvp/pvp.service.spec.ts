import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { PvpService } from './pvp.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { MemberModule } from '../member/member.module';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';
import { DiscordModule } from '../discord/discord.module';
import { PvpShieldService } from './pvp-shield/pvp-shield.service';
import { PvpShieldSchema } from './pvp-shield/pvp-shield.model';

describe('PvpService', () => {
  let service: PvpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('pvp service'),
        MongooseModule.forFeature([
          { name: 'PvpShield', schema: PvpShieldSchema },
        ]),
        DiscordModule,
        MemberModule,
        BuildingsModule,
        TroopsModule,
        ResourcesModule,
      ],
      providers: [
        PvpService,
        PvpNotifierService,
        PvpComputerService,
        PvpShieldService,
      ],
    }).compile();

    service = module.get<PvpService>(PvpService);
  });

  afterEach(async () => {
    await closeInMongodConnection('pvp service');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
