import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsHandler } from './buildings.handler';
import { BuildingsModule } from '../../../../buildings/buildings.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test-utils/mongo/MongooseTestModule';

describe('BuildingHandler', () => {
  let buildingsHandler: BuildingsHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule('building handler'), BuildingsModule],
      providers: [BuildingsHandler],
    }).compile();

    buildingsHandler = module.get<BuildingsHandler>(BuildingsHandler);
  });

  afterAll(async () => {
    await closeInMongodConnection('building handler');
  });

  it('should be defined', () => {
    expect(buildingsHandler).toBeDefined();
  });

  it('should respond to "colonie buildings" case insensitive', () => {
    expect(buildingsHandler.test('colonie buildings')).toBeTruthy();
    expect(buildingsHandler.test('colonie BUILDINGS')).toBeTruthy();
    expect(
      buildingsHandler.test('only if in the beginning colonie buildings'),
    ).toBeFalsy();
  });
});
