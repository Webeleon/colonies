import { Test, TestingModule } from '@nestjs/testing';
import { DismissHandler } from './dismiss.handler';
import { TroopsModule } from '../../../../troops/troops.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test-utils/mongo/MongooseTestModule';

describe('DismissService', () => {
  let service: DismissHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), TroopsModule],
      providers: [DismissHandler],
    }).compile();

    service = module.get<DismissHandler>(DismissHandler);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
