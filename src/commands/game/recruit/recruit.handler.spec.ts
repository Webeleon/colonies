import { Test, TestingModule } from '@nestjs/testing';
import { RecruitHandler } from './recruit.handler';

describe('RecruitHandler', () => {
  let recruitHandler: RecruitHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitHandler],
    }).compile();

    recruitHandler = module.get<RecruitHandler>(RecruitHandler);
  });

  it('should be defined', () => {
    expect(recruitHandler).toBeDefined();
  });
});
