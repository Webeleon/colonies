import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { Message } from 'discord.js';

import { HelpHandler } from './help.handler';
import { GENERAL_HELP_DESCRIPTION } from './help.constants';

describe('HelpHandler', () => {
  let service: HelpHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpHandler],
    }).compile();

    service = module.get<HelpHandler>(HelpHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should respond on !help', () => {
    expect(service.test('colonie help')).toBeTruthy();
    expect(service.test('colonie HELP')).toBeTruthy();
  });

  it('should send generic help', async () => {
    const sendStub = sinon.stub();
    const message = {
      content: 'colonie help',
      channel: {
        send: sendStub,
      },
    } as any;

    await service.execute(message);
    expect(sendStub.calledOnce).toBeTruthy();
    expect(sendStub.getCall(0).args[0].title).toEqual('Colonie help');
    expect(sendStub.getCall(0).args[0].description).toEqual(
      GENERAL_HELP_DESCRIPTION,
    );
  });

  it('should send pvp help', async () => {
    const sendStub = sinon.stub();
    const message = {
      content: 'colonie help pvp',
      channel: {
        send: sendStub,
      },
    } as any;

    await service.execute(message);
    expect(sendStub.calledOnce).toBeTruthy();
    expect(sendStub.getCall(0).args[0].title).toEqual('Colonie pvp');
  });
});
