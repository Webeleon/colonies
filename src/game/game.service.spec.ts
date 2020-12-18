import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { MemberModule } from '../member/member.module';
import { TroopsModule } from '../troops/troops.module';
import { BuildingsModule } from '../buildings/buildings.module';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('game service'),
        MemberModule,
        TroopsModule,
        BuildingsModule,
      ],
      providers: [GameService],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  afterEach(async () => {
    await closeInMongodConnection('game service');
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });
});
