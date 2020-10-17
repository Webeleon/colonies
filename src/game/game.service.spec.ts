import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { closeInMongodConnection, rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
      ],
      providers: [GameService],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });
});
