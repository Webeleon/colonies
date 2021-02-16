import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { ResourcesService } from './resources.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { ResourcesSchema } from './resources.model';
import { INITIAL_FOOD_SUPPLY } from '../game/resources.constants';

describe('RessourcesService', () => {
  let service: ResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Resources', schema: ResourcesSchema },
        ]),
      ],
      providers: [ResourcesService],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create resource inventory on request', async () => {
    const member1 = await service.getResourcesForMember('member1');
    expect(member1.memberDiscordId).toEqual('member1');
    expect(member1.food).toEqual(INITIAL_FOOD_SUPPLY);
  });

  it('can add food to a player resources', async () => {
    const member = await service.getResourcesForMember('member2');
    await service.addFoodToMemberResources('member2', 5);

    const memberInMongo = await service.getResourcesForMember('member2');
    expect(memberInMongo.food).toEqual(INITIAL_FOOD_SUPPLY + 5);
  });
});
