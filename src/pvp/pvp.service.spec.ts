import { Test, TestingModule } from '@nestjs/testing';
import { PvpService } from './pvp.service';
import { rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { MemberModule } from '../member/member.module';
import { PvpNotifierService } from './pvp-notifier/pvp-notifier.service';
import { PvpComputerService } from './pvp-computer/pvp-computer.service';
import { DiscordModule } from '../discord/discord.module';

describe('PvpService', () => {
  let service: PvpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        DiscordModule,
        MemberModule,
        BuildingsModule,
        TroopsModule,
        ResourcesModule,
      ],
      providers: [PvpService, PvpNotifierService, PvpComputerService],
    }).compile();

    service = module.get<PvpService>(PvpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
