import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { TroopsService } from './troops.service';
import { rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';
import { TroopsSchema } from './troops.model';
import { ResourcesModule } from '../resources/resources.module';
import { BuildingsModule } from '../buildings/buildings.module';

describe('TroopsService', () => {
  let service: TroopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Troops', schema: TroopsSchema }]),
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [TroopsService],
    }).compile();

    service = module.get<TroopsService>(TroopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
