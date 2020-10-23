import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { ICommandHandler } from '../ICommandHandler';
import { WORK_LIMIT_IN_MINUTES } from '../../game/limits.constants';
import { GENERAL_HELP_DESCRIPTION } from './help.constants';

@Injectable()
export class HelpHandler implements ICommandHandler {
  name = 'help';
  test(content: string): boolean {
    return /^colonie help/i.test(content);
  }

  async execute(message: Message): Promise<void> {
    message.channel.send({
      embed: {
        title: 'Colonie',
        description: GENERAL_HELP_DESCRIPTION,
        fields: [
          {
            name: 'colonie resources',
            value: 'Display you colonie inventory',
          },
          {
            name: 'colonie troops',
            value: 'display your colonie troops'
          },
          {
            name: 'colonie recruit <troop type>',
            value: 'recruit the requested troop. `colonie recruit help` for more',
          },
          {
            name: 'colonie buildings',
            value: 'display your colonie buildings',
          },
          {
            name: 'colonie build <building type>',
            value: 'build the requested builing. `colonie build help` for more',
          },
          {
            name: 'colonie work',
            value: `Send workers to the job. Can be used every ${WORK_LIMIT_IN_MINUTES} minutes.`,
          },
          {
            name: 'colonie help',
            value: 'display this message',
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
