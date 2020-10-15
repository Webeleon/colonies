import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { ICommandHandler } from '../ICommandHandler';

@Injectable()
export class HelpHandler implements ICommandHandler {
  name = 'help';
  test(content: string): boolean {
    return /^colonie help/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    message.reply({
      embed: {
        title: 'Colonie',
        description: 'A text based management and exploration game.',
        fields: [
          {
            name: 'colonie help',
            value: 'display this message',
          },
          {
            name: 'colonie ping',
            value: 'reply `pong!`',
          },
          {
            name: 'colonie invite',
            value: 'Send an invite link for this awesome bot!',
          },
        ],
      },
    });
  }
}
