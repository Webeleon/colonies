import { Test, TestingModule } from '@nestjs/testing';
import { BuildHandler } from './build.handler';
import { BuildingsModule } from '../../../../buildings/buildings.module';
import { rootMongooseTestModule } from '../../../../test-utils/mongo/MongooseTestModule';

describe('BuildHandler', () => {
  let buildHandler: BuildHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        BuildingsModule
      ],
      providers: [BuildHandler],
    }).compile();

    buildHandler = module.get<BuildHandler>(BuildHandler);
  });

  it('should be defined', () => {
    expect(buildHandler).toBeDefined();
  });

  it('should respond to "colonie build <builing type>" case insensitive', () => {
    expect(buildHandler.test('colonie build farm')).toBeTruthy();
    expect(buildHandler.test('colonie build')).toBeTruthy();
    expect(buildHandler.test('COLONIE BUILD home')).toBeTruthy();
  });
});
