import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { VoteReminderToggleHandler } from './vote-reminder-toggle.handler';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test-utils/mongo/MongooseTestModule';
import { TopggModule } from '../../../topgg/topgg.module';
import { VoteReminderService } from '../../../topgg/vote-reminder-service/vote-reminder.service';
import { MessageEmbed } from 'discord.js';

describe('VoteReminderToggleService', () => {
  const sandbox = sinon.createSandbox();
  let reminderToggleHandler: VoteReminderToggleHandler;
  let voteReminderService: VoteReminderService;

  beforeEach(async () => {
    sandbox.restore();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), TopggModule],
      providers: [VoteReminderToggleHandler],
    }).compile();

    reminderToggleHandler = module.get<VoteReminderToggleHandler>(
      VoteReminderToggleHandler,
    );
    voteReminderService = module.get<VoteReminderService>(VoteReminderService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(reminderToggleHandler).toBeDefined();
  });

  it('respond to `colonie vote reminder on|off` case insensitive', () => {
    expect(reminderToggleHandler.test('colonie vote reminder on')).toBeTruthy();
    expect(
      reminderToggleHandler.test('colonie vote reminder OFF'),
    ).toBeTruthy();
    expect(
      reminderToggleHandler.test('colonie vote reminder coco'),
    ).toBeFalsy();
    expect(
      reminderToggleHandler.test('you can user colonie vote reminder on'),
    ).toBeFalsy();
  });

  it('subscribe', async () => {
    const message = {
      content: `colonie vote reminder on`,
      author: {
        id: 'foo',
        send: sinon.stub(),
      },
    } as any;
    const subscribeStub = sandbox.stub(voteReminderService, 'subscribe');

    await reminderToggleHandler.execute(message);
    expect(subscribeStub.callCount).toEqual(1);
    expect(message.author.send.getCall(0).args[0]).toBeInstanceOf(MessageEmbed);
  });

  it('unsubscribe', async () => {
    const message = {
      content: `colonie vote reminder off`,
      author: {
        id: 'foo',
        send: sinon.stub(),
      },
    } as any;
    const unsubscribeStub = sandbox.stub(voteReminderService, 'unsubscribe');

    await reminderToggleHandler.execute(message);
    expect(unsubscribeStub.callCount).toEqual(1);
    expect(message.author.send.getCall(0).args[0]).toBeInstanceOf(MessageEmbed);
  });
});
