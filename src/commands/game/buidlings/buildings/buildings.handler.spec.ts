import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsHandler } from './buildings.handler';

describe('BuildingsService', () => {
  let service: BuildingsHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildingsHandler],
    }).compile();

    service = module.get<BuildingsHandler>(BuildingsHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
