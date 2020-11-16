import { Test, TestingModule } from '@nestjs/testing';
import { PvpComputerService } from './pvp-computer.service';
import { rootMongooseTestModule } from '../../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../../troops/troops.module';
import { BuildingsModule } from '../../buildings/buildings.module';
import { ResourcesModule } from '../../resources/resources.module';

describe('PvpComputerService', () => {
  let service: PvpComputerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        TroopsModule,
        BuildingsModule,
        ResourcesModule,
      ],
      providers: [PvpComputerService],
    }).compile();

    service = module.get<PvpComputerService>(PvpComputerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
