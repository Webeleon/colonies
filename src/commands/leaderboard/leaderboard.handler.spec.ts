import { Test, TestingModule } from '@nestjs/testing';
import { MessageEmbed } from 'discord.js';
import * as sinon from 'sinon';
import { LeaderboardModule } from '../../leaderboard/leaderboard.module';
import { rootMongooseTestModule } from '../../test-utils/mongo/MongooseTestModule';

import { LeaderboardHandler, leaderboardScopes } from './leaderboard.handler';
import { leaderboardTopics } from '../../leaderboard/leaderboard.service';

describe('LeaderboardHandler', () => {
  let handler: LeaderboardHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), LeaderboardModule],
      providers: [LeaderboardHandler],
    }).compile();

    handler = module.get<LeaderboardHandler>(LeaderboardHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it(`Respond to 'colonie leaderboard <scope?> <topic?>`, () => {
    expect(handler.test('colonie leaderboard')).toBeTruthy();
    expect(handler.test('COLONie LeaderBoard')).toBeTruthy();

    expect(handler.test('use: colonie leaderboard')).toBeFalsy();

    expect(handler.test('colonie leaderboard global')).toBeTruthy();
    expect(handler.test('colonie leaderboard server')).toBeTruthy();

    expect(handler.test('colonie leaderboard server pvp')).toBeTruthy();
    expect(handler.test('colonie leaderboard server resources')).toBeTruthy();
    expect(handler.test('colonie leaderboard server buildings')).toBeTruthy();
    expect(handler.test('colonie leaderboard server troops')).toBeTruthy();

    expect(handler.test('colonie leaderboard global pvp')).toBeTruthy();
    expect(handler.test('colonie leaderboard global resources')).toBeTruthy();
    expect(handler.test('colonie leaderboard global buildings')).toBeTruthy();
    expect(handler.test('colonie leaderboard global troops')).toBeTruthy();

    expect(handler.test('colonie leaderboard pvp')).toBeTruthy();
    expect(handler.test('colonie leaderboard resources')).toBeTruthy();
    expect(handler.test('colonie leaderboard buildings')).toBeTruthy();
    expect(handler.test('colonie leaderboard troops')).toBeTruthy();
  });

  describe('execute', () => {
    it('returns an embed', async () => {
      const message = {
        content: 'colonie leaderboard server pvp',
        channel: {
          send: sinon.stub(),
        },
        guild: {
          id: 'fake guild id',
        },
      } as any;

      await handler.execute(message);

      expect(message.channel.send.getCall(0).args[0]).toBeInstanceOf(
        MessageEmbed,
      );
    });
  });

  it(`extract scope`, async () => {
    expect(handler.extractScope(`colonie leaderboard`)).toEqual(
      leaderboardScopes.SERVER,
    );
    expect(handler.extractScope(`colonie leaderboard pvp`)).toEqual(
      leaderboardScopes.SERVER,
    );
    expect(handler.extractScope(`colonie leaderboard server pvp`)).toEqual(
      leaderboardScopes.SERVER,
    );
    expect(handler.extractScope(`colonie leaderboard global`)).toEqual(
      leaderboardScopes.GLOBAL,
    );
    expect(handler.extractScope(`colonie leaderboard global pvp`)).toEqual(
      leaderboardScopes.GLOBAL,
    );
  });

  it(`extract topic`, async () => {
    expect(handler.extractTopic(`colonie leaderboard`)).toEqual(
      leaderboardTopics.TOTAL,
    );
    expect(handler.extractTopic(`colonie leaderboard server`)).toEqual(
      leaderboardTopics.TOTAL,
    );
    expect(handler.extractTopic(`colonie leaderboard global`)).toEqual(
      leaderboardTopics.TOTAL,
    );

    expect(handler.extractTopic(`colonie leaderboard pvp`)).toEqual(
      leaderboardTopics.PVP,
    );
    expect(handler.extractTopic(`colonie leaderboard server pvp`)).toEqual(
      leaderboardTopics.PVP,
    );
    expect(handler.extractTopic(`colonie leaderboard global pvp`)).toEqual(
      leaderboardTopics.PVP,
    );

    expect(handler.extractTopic(`colonie leaderboard troops`)).toEqual(
      leaderboardTopics.TROOPS,
    );
    expect(handler.extractTopic(`colonie leaderboard server troops`)).toEqual(
      leaderboardTopics.TROOPS,
    );
    expect(handler.extractTopic(`colonie leaderboard global troops`)).toEqual(
      leaderboardTopics.TROOPS,
    );

    expect(handler.extractTopic(`colonie leaderboard buildings`)).toEqual(
      leaderboardTopics.BUILDINGS,
    );
    expect(
      handler.extractTopic(`colonie leaderboard server buildings`),
    ).toEqual(leaderboardTopics.BUILDINGS);
    expect(
      handler.extractTopic(`colonie leaderboard global buildings`),
    ).toEqual(leaderboardTopics.BUILDINGS);

    expect(handler.extractTopic(`colonie leaderboard resources`)).toEqual(
      leaderboardTopics.RESOURCES,
    );
    expect(
      handler.extractTopic(`colonie leaderboard server resources`),
    ).toEqual(leaderboardTopics.RESOURCES);
    expect(
      handler.extractTopic(`colonie leaderboard global resources`),
    ).toEqual(leaderboardTopics.RESOURCES);
  });
});
