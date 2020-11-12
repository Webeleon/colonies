import { Test, TestingModule } from '@nestjs/testing';

import { CommandsService } from './commands.service';
import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { ConfigModule } from '../config/config.module';
import { ResourcesModule } from '../resources/resources.module';
import { ResourcesHandler } from './game/resources/resources.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { RecruitHandler } from './game/troops/recruit/recruit.handler';
import { TroopsModule } from '../troops/troops.module';
import { TroopsReportHandler } from './game/troops/troops-report/troopsReport.handler';
import { WorkModule } from '../work/work.module';
import { WorkHandler } from './game/work/work.handler';
import { BuildHandler } from './game/buidlings/build/build.handler';
import { BuildingsModule } from '../buildings/buildings.module';
import { BuildingsHandler } from './game/buidlings/buildings/buildings.handler';
import { GameModule } from '../game/game.module';
import { MemberModule } from '../member/member.module';
import { DismissHandler } from './game/troops/dismiss/dismiss.handler';

describe('CommandsService', () => {
  let service: CommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule,
        ResourcesModule,
        TroopsModule,
        WorkModule,
        BuildingsModule,
        GameModule,
        MemberModule,
      ],
      providers: [
        CommandsService,
        PingHandler,
        InviteHandler,
        HelpHandler,
        StatusHandler,
        ResourcesHandler,
        RecruitHandler,
        DismissHandler,
        TroopsReportHandler,
        WorkHandler,
        BuildHandler,
        BuildingsHandler,
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
