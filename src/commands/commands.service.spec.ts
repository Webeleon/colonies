import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { ConfigModule } from '../config/config.module';
import { ResourcesModule } from '../resources/resources.module';
import { ResourcesHandler } from './game/resources/resources.handler';
import { closeInMongodConnection, rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';

describe('CommandsService', () => {
  let service: CommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule, ResourcesModule
      ],
      providers: [
        CommandsService,
        PingHandler,
        InviteHandler,
        HelpHandler,
        StatusHandler,
        ResourcesHandler
      ],
    }).compile();

    service = module.get<CommandsService>(CommandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
      await closeInMongodConnection();
  });
});
