import { Test, TestingModule } from '@nestjs/testing';
import { TroopsHandler } from './troops.handler';
import { TroopsModule } from '../../../troops/troops.module';
import { closeInMongodConnection, rootMongooseTestModule } from '../../../test-utils/mongo/MongooseTestModule';

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

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(troopsHandler).toBeDefined();
  });

  it('respond to the command "colonie troops" case insensitive', () => {
    expect(troopsHandler.test('colonie troops')).toBeTruthy();
    expect(troopsHandler.test('COLOnie TrOoPs')).toBeTruthy();
    expect(troopsHandler.test('col troops')).toBeTruthy();
    expect(troopsHandler.test('COLO troops')).toBeTruthy();
    expect(troopsHandler.test('it should start with the command colonie troops')).toBeFalsy();
  });
});
