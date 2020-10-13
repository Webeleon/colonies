import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesHandler } from './resources.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test-utils/mongo/MongooseTestModule';
import { ResourcesModule } from '../../../resources/resources.module';

describe('ResourcesHandler', () => {
  let resourcesHandler: ResourcesHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), ResourcesModule],
      providers: [ResourcesHandler],
    }).compile();

    resourcesHandler = module.get<ResourcesHandler>(ResourcesHandler);
  });

  it('should be defined', () => {
    expect(resourcesHandler).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
