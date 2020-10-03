import { Test, TestingModule } from '@nestjs/testing';
import { WorkHandler } from './work.handler';

describe('WorkHandler', () => {
  let workHandler: WorkHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkHandler],
    }).compile();

    workHandler = module.get<WorkHandler>(WorkHandler);
  });

  it('should be defined', () => {
    expect(workHandler).toBeDefined();
  });
});
