import { Test, TestingModule } from '@nestjs/testing';
import { PvpNotifierService } from './pvp-notifier.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { DiscordModule } from '../../discord/discord.module';
import { MemberModule } from '../../member/member.module';

describe('PvpNotifierService', () => {
  let service: PvpNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), DiscordModule, MemberModule],
      providers: [PvpNotifierService],
    }).compile();

    service = module.get<PvpNotifierService>(PvpNotifierService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
