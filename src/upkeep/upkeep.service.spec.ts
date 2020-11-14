import { Test, TestingModule } from '@nestjs/testing';
import * as _ from 'lodash';

import { UpkeepService } from './upkeep.service';
import { DiscordModule } from '../discord/discord.module';
import { TroopsModule } from '../troops/troops.module';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { MemberModule } from '../member/member.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { UpkeepTaxesService } from './upkeep-taxes/upkeep-taxes.service';
import { UpkeepNotifierService } from './upkeep-notifier/upkeep-notifier.service';
import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector/upkeep-taxes-collector.service';

describe('UpkeepService', () => {
  let service: UpkeepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        DiscordModule,
        TroopsModule,
        ResourcesModule,
        BuildingsModule,
        MemberModule,
      ],
      providers: [
        UpkeepService,
        UpkeepTaxesService,
        UpkeepNotifierService,
        UpkeepTaxesCollectorService,
      ],
    }).compile();

    service = module.get<UpkeepService>(UpkeepService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
