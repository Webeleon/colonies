import { Test, TestingModule } from '@nestjs/testing';
import { WorkService } from './work.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { TroopsModule } from '../troops/troops.module';
import { ResourcesModule } from '../resources/resources.module';
import { GameModule } from '../game/game.module';

describe('WorkService', () => {
  let service: WorkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('work service'),
        TroopsModule,
        ResourcesModule,
        GameModule,
      ],
      providers: [WorkService],
    }).compile();

    service = module.get<WorkService>(WorkService);
  });

  afterEach(async () => {
    await closeInMongodConnection('work service');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
