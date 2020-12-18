import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { BuildingsService } from './buildings.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { BuildingSchema } from './buildings.model';
import { ResourcesModule } from '../resources/resources.module';

describe('BuildingsService', () => {
  let service: BuildingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('building service spec'),
        MongooseModule.forFeature([
          { name: 'Buildings', schema: BuildingSchema },
        ]),
        ResourcesModule,
      ],
      providers: [BuildingsService],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
  });

  afterEach(async () => {
    await closeInMongodConnection('building service spec');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
