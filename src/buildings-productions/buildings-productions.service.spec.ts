import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsProductionsService } from './buildings-productions.service';
import { BuildingsModule } from '../buildings/buildings.module';
import { ResourcesModule } from '../resources/resources.module';
import { DiscordModule } from '../discord/discord.module';
import { closeInMongodConnection, rootMongooseTestModule } from '../test-utils/mongo/MongooseTestModule';

describe('BuildingsProductionsService', () => {
  let service: BuildingsProductionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        BuildingsModule, ResourcesModule, DiscordModule],
      providers: [BuildingsProductionsService],
    }).compile();

    service = module.get<BuildingsProductionsService>(BuildingsProductionsService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
