import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as moment from 'moment';

import { VoteReminderService } from './vote-reminder.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import {
  VOTE_REMINDER_MODEL_NAME,
  VoteReminderDocument,
  VoteReminderSchema,
} from './vote-reminder.model';

describe('VoteReminderService', () => {
  let voteReminderService: VoteReminderService;
  let VoteReminderModel: Model<VoteReminderDocument>;
  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: VOTE_REMINDER_MODEL_NAME, schema: VoteReminderSchema },
        ]),
      ],
      providers: [VoteReminderService],
    }).compile();

    voteReminderService = module.get<VoteReminderService>(VoteReminderService);
    VoteReminderModel = module.get<Model<VoteReminderDocument>>(
      VOTE_REMINDER_MODEL_NAME + 'Model',
    );
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  beforeEach(() => {
    sandbox.restore();
  });

  it('should be defined', () => {
    expect(voteReminderService).toBeDefined();
  });

  it('getVoteReminder', async () => {
    const PLAYER_ID = 'coco';
    const reminder = await voteReminderService.getVoteReminder(PLAYER_ID);
    expect(reminder).toBeDefined();
    expect(reminder.memberDiscordId).toEqual(PLAYER_ID);

    await voteReminderService.getVoteReminder(PLAYER_ID);
    const reminders = await VoteReminderModel.find({});
    expect(reminders.length).toEqual(1);
  });

  it('subscribe and unsubcribe to vote reminder', async () => {
    const PLAYER_ID = 'id of a subscribed player';

    await voteReminderService.subscribe(PLAYER_ID);
    const subscribedReminder = await VoteReminderModel.findOne({
      memberDiscordId: PLAYER_ID,
    });

    expect(subscribedReminder.subscribed).toBeTruthy();

    await voteReminderService.unsubscribe(PLAYER_ID);
    const unsubscribedReminder = await VoteReminderModel.findOne({
      memberDiscordId: PLAYER_ID,
    });

    expect(unsubscribedReminder.subscribed).toBeFalsy();
  });

  it('provide a list of reminder to notify', async () => {
    await VoteReminderModel.create([
      {
        memberDiscordId: 'to be notified',
        subscribed: true,
        notified: false,
        lastVote: moment()
          .subtract(60 * 12 + 1, 'minutes')
          .toDate(),
        voteCount: 0,
      },
      {
        memberDiscordId: 'already notified',
        subscribed: true,
        notified: true,
        lastVote: moment()
          .subtract(60 * 12 + 1, 'minutes')
          .toDate(),
        voteCount: 0,
      },
      {
        memberDiscordId: 'not notified',
        subscribed: true,
        notified: false,
        lastVote: moment().subtract(11, 'hours').toDate(),
        voteCount: 0,
      },
      {
        memberDiscordId: 'not subscribed',
        subscribed: false,
        notified: false,
        lastVote: moment()
          .subtract(60 * 12 + 1, 'minutes')
          .toDate(),
        voteCount: 0,
      },
    ]);

    const subs = await voteReminderService.getSubsToNotify();
    expect(subs.length).toEqual(1);
    expect(subs[0].memberDiscordId).toEqual('to be notified');
  });

  it('mark a reminder as notified', async () => {
    const PLAYER_ID = 'mark as notified';
    await voteReminderService.markAsNotified(PLAYER_ID);
    const reminder = await VoteReminderModel.findOne({
      memberDiscordId: PLAYER_ID,
    });
    expect(reminder.notified).toBeTruthy();
  });

  it('mark vote', async () => {
    const PLAYER_ID = 'mark vote';
    await voteReminderService.markVote(PLAYER_ID);
    const reminder = await VoteReminderModel.findOne({
      memberDiscordId: PLAYER_ID,
    });
    expect(reminder.notified).toBeFalsy();
    expect(reminder.voteCount).toEqual(1);
  });
});
