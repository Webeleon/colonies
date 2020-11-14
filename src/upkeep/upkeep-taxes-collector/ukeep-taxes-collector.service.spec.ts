import { Test, TestingModule } from '@nestjs/testing';
import { UpkeepTaxesCollectorService } from './upkeep-taxes-collector.service';
import { rootMongooseTestModule } from '../../test-utils/mongo/MongooseTestModule';
import { ResourcesModule } from '../../resources/resources.module';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';

describe('UkeepTaxesCollectorService', () => {
  let service: UpkeepTaxesCollectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
