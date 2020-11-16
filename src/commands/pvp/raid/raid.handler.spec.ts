import { Test, TestingModule } from '@nestjs/testing';
import { RaidHandler } from './raid.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test-utils/mongo/MongooseTestModule';
import { PvpModule } from '../../../pvp/pvp.module';
import { DiscordModule } from '../../../discord/discord.module';

describe('RaidHandler', () => {
  let service: RaidHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), PvpModule, DiscordModule],
      providers: [RaidHandler],
    }).compile();

    service = module.get<RaidHandler>(RaidHandler);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should respond to `colonie raid @player', () => {
    expect(service.test('colonie raid <@!123123123>')).toBeTruthy();
    expect(service.test('colonie RAId <@!123123>')).toBeTruthy();
    expect(service.test('exemple colonie raid <@!12312312>')).toBeFalsy();
  });
});
