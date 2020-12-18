import { Test, TestingModule } from '@nestjs/testing';
import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { ResourcesModule } from '../../resources/resources.module';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';

describe('UkeepTaxesCollectorService', () => {
  let service: UpkeepTaxesCollectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('upkeep taxe collector'),
        ResourcesModule,
        TroopsModule,
        BuildingsModule,
      ],
      providers: [UpkeepTaxesCollectorService],
    }).compile();

    service = module.get<UpkeepTaxesCollectorService>(
      UpkeepTaxesCollectorService,
    );
  });

  afterEach(async () => {
    await closeInMongodConnection('upkeep taxe collector');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
