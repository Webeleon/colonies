import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsProductionsService } from './buildings-productions.service';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { DiscordModule } from '../discord/discord.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { MemberModule } from '../member/member.module';

describe('BuildingsProductionsService', () => {
  let service: BuildingsProductionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule('building production'),
        BuildingsModule,
        ResourcesModule,
        DiscordModule,
        MemberModule,
      ],
      providers: [BuildingsProductionsService],
    }).compile();

    service = module.get<BuildingsProductionsService>(
      BuildingsProductionsService,
    );
  });

  afterEach(async () => {
    await closeInMongodConnection('building production');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
