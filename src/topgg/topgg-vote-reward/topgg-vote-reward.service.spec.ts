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
import {
  VOTE_BUILDING_MATERIALS_REWARD,
  VOTE_FOOD_REWARD,
  VOTE_GOLD_REWARD,
  VOTE_WEEKEND_MULTIPLIER,
  WEEKEND_VOTE_HOUSE_REWARD,
  WEEKEND_VOTE_LIGHT_INFANTRY_REWARD,
} from '../../game/vote.constants';

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

  it('compute reward', () => {
    const reward = TopggVoteRewardService.computeReward(false);

    expect(reward.food).toEqual(VOTE_FOOD_REWARD);
    expect(reward.buildingMaterials).toEqual(VOTE_BUILDING_MATERIALS_REWARD);
    expect(reward.gold).toEqual(VOTE_GOLD_REWARD);
    expect(reward.house).toBeUndefined();
    expect(reward.lightInfantry).toBeUndefined();

    const weekendReward = TopggVoteRewardService.computeReward(true);

    expect(weekendReward.food).toEqual(
      VOTE_FOOD_REWARD * VOTE_WEEKEND_MULTIPLIER,
    );
    expect(weekendReward.buildingMaterials).toEqual(
      VOTE_BUILDING_MATERIALS_REWARD * VOTE_WEEKEND_MULTIPLIER,
    );
    expect(weekendReward.gold).toEqual(
      VOTE_GOLD_REWARD * VOTE_WEEKEND_MULTIPLIER,
    );
    expect(weekendReward.house).toEqual(WEEKEND_VOTE_HOUSE_REWARD);
    expect(weekendReward.lightInfantry).toEqual(
      WEEKEND_VOTE_LIGHT_INFANTRY_REWARD,
    );
  });
});
