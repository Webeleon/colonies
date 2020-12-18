import { Test, TestingModule } from '@nestjs/testing';
import { DismissHandler } from './dismiss.handler';
import { TroopsModule } from '../../../../troops/troops.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test-utils/mongo/MongooseTestModule';

describe('DismissHandler', () => {
  let service: DismissHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule('dismiss handler'), TroopsModule],
      providers: [DismissHandler],
    }).compile();

    service = module.get<DismissHandler>(DismissHandler);
  });

  afterEach(async () => {
    await closeInMongodConnection('dismiss handler');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
