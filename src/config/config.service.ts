import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

@Injectable()
export class ConfigService {
  public readonly port: number;
  public readonly mongoURL: string;

  public readonly discordToken: string;
  public readonly discordClientId: string;

  public readonly topGGToken: string;
  public readonly topGGHookPort: number;
  public readonly topGGHookPassword: string;
  public readonly topGGBotId: string;

  constructor() {
    config();
    this.port = parseInt(process.env.PORT) || 5000;
    this.discordToken = process.env.DISCORD_API_TOKEN || '';
    this.discordClientId = process.env.DISCORD_CLIENT_ID || '';
    this.mongoURL = process.env.MONGO_URL || 'mongodb://localhost/colonie';

    this.topGGToken = process.env.TOP_GG_TOKEN || '';
    this.topGGHookPort = parseInt(process.env.TOP_GG_HOOK_PORT) || 5001;
    this.topGGHookPassword = process.env.TOP_GG_HOOK_PASSWORD || 'password';
    this.topGGBotId = process.env.TOP_GG_BOT_ID || 'invalid';
  }

  getBotInviteLink(permissions = '1075305537'): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.discordClientId}&scope=bot&permissions=${permissions}`;
  }

  getBotVoteLink(): string {
    return `https://top.gg/bot/${this.topGGBotId}/vote`;
  }
}
