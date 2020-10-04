import { Test, TestingModule } from '@nestjs/testing';
import { TroopsHandler } from './troops.handler';
import { TroopsModule } from '../../../troops/troops.module';
import { rootMongooseTestModule } from '../../../test-utils/mongo/MongooseTestModule';

describe('TroopsHandler', () => {
  let troopsHandler: TroopsHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        TroopsModule,
      ],
      providers: [TroopsHandler],
    }).compile();

    troopsHandler = module.get<TroopsHandler>(TroopsHandler);
  });

  it('should be defined', () => {
    expect(troopsHandler).toBeDefined();
  });
});
