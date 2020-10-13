import { Test, TestingModule } from '@nestjs/testing';
import { RecruitHandler } from './recruit.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../../../troops/troops.module';

describe('RecruitHandler', () => {
  let recruitHandler: RecruitHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), TroopsModule],
      providers: [RecruitHandler],
    }).compile();

    recruitHandler = module.get<RecruitHandler>(RecruitHandler);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(recruitHandler).toBeDefined();
  });

  it('should test valid for "colonies recruit <troop type>" case insensitive', () => {
    expect(recruitHandler.test('colonie recruit gatherer')).toBeTruthy();
    expect(recruitHandler.test('COLONIE recruit gatherer')).toBeTruthy();
    expect(recruitHandler.test('nope COLONIE recruit gatherer')).toBeFalsy();
  });
});
