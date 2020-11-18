import { Test, TestingModule } from '@nestjs/testing';
import { TopggVoteRewardService } from './topgg-vote-reward.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { DiscordModule } from '../../discord/discord.module';
import { MemberModule } from '../../member/member.module';
import { TroopsModule } from '../../troops/troops.module';
import { ResourcesModule } from '../../resources/resources.module';
import { BuildingsModule } from '../../buildings/buildings.module';

describe('TopggVoteRewardService', () => {
  let service: TopggVoteRewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        DiscordModule,
        MemberModule,
        TroopsModule,
        ResourcesModule,
        BuildingsModule,
      ],
      providers: [TopggVoteRewardService],
    }).compile();

    service = module.get<TopggVoteRewardService>(TopggVoteRewardService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
