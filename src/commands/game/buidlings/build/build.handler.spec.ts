import { Test, TestingModule } from '@nestjs/testing';
import { BuildHandler } from './build.handler';
import { BuildingsModule } from '../../../../buildings/buildings.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test-utils/mongo/MongooseTestModule';

describe('BuildHandler', () => {
  let buildHandler: BuildHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule('build handler'), BuildingsModule],
      providers: [BuildHandler],
    }).compile();

    buildHandler = module.get<BuildHandler>(BuildHandler);
  });

  afterEach(async () => {
    await closeInMongodConnection('build handler');
  });

  it('should be defined', () => {
    expect(buildHandler).toBeDefined();
  });

  it('should respond to "colonie build <builing type>" case insensitie', () => {
    expect(buildHandler.test('colonie build farm')).toBeTruthy();
    expect(buildHandler.test('COLONIE BUILD house')).toBeTruthy();
  });
});
