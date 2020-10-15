import { Test, TestingModule } from '@nestjs/testing';
import { InviteHandler } from './invite.handler';
import { DiscordModule } from '../../discord/discord.module';
import { ConfigModule } from '../../config/config.module';

describe('InviteHandler', () => {
  let service: InviteHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscordModule, ConfigModule],
      providers: [InviteHandler],
    }).compile();

    service = module.get<InviteHandler>(InviteHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should test on !invite', () => {
    expect(service.test('colonie invite')).toBeTruthy();
    expect(service.test('colonie INVITE')).toBeTruthy();
    expect(service.test('colonie Invite ')).toBeTruthy();
    expect(service.test('COLONIE inVite')).toBeTruthy();
  });
});
