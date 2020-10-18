import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { MemberModule } from '../member/member.module';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MemberModule],
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
