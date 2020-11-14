import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';

import { ICommandHandler } from '../../ICommandHandler';

@Injectable()
export class RaidHandler implements ICommandHandler {
  name = 'colonie raid @player';
  description =
    'launch an attack on the specified player. All discord member can be attacked!';
  regex = new RegExp(`^colonie raid <@![0-9]+>`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  execute(message: Message): Promise<void> {
    throw new Error('raid WIP');
  }
}
