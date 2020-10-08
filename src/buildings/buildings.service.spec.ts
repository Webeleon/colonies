import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { BuildingsService } from './buildings.service';
import { closeInMongodConnection, rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';
import { BuildingSchema } from './buildings.model';
import { ResourcesService } from '../resources/resources.service';
import { ResourcesModule } from '../resources/resources.module';

describe('BuildingsService', () => {
  let service: BuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Buildings', schema: BuildingSchema }
        ]),
        ResourcesModule,
      ],
      providers: [BuildingsService],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
  });

  afterAll(async () => {
      await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
