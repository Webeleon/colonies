import { Test, TestingModule } from '@nestjs/testing';
import { VoteHandler } from './vote.handler';
import { MessageEmbed } from 'discord.js';
import * as sinon from 'sinon';

import { ConfigModule } from '../../config/config.module';
import { TopggModule } from '../../topgg/topgg.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';

describe('VoteHandler', () => {
  let voteHandler: VoteHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), ConfigModule, TopggModule],
      providers: [VoteHandler],
    }).compile();

    voteHandler = module.get<VoteHandler>(VoteHandler);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(voteHandler).toBeDefined();
  });

  it('respond to the command; `colonie vote` case insensitive', () => {
    expect(voteHandler.test('colonie vote')).toBeTruthy();
    expect(voteHandler.test('CoLonie VOTE')).toBeTruthy();
    expect(voteHandler.test('type colonie cote')).toBeFalsy();
  });
});
