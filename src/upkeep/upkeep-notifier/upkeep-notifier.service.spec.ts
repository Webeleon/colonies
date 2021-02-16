import { Test, TestingModule } from '@nestjs/testing';
import { UpkeepNotifierService } from './upkeep-notifier.service';
import { DiscordModule } from '../../discord/discord.module';
import { MemberModule } from '../../member/member.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';

describe('UpkeepNotifierService', () => {
  let service: UpkeepNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), DiscordModule, MemberModule],
      providers: [UpkeepNotifierService],
    }).compile();

    service = module.get<UpkeepNotifierService>(UpkeepNotifierService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
