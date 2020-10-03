import { Test, TestingModule } from '@nestjs/testing';
import { TroopsHandler } from './troops.handler';

describe('TroopsHandler', () => {
  let troopsHandler: TroopsHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TroopsHandler],
    }).compile();

    troopsHandler = module.get<TroopsHandler>(TroopsHandler);
  });

  it('should be defined', () => {
    expect(troopsHandler).toBeDefined();
  });
});
