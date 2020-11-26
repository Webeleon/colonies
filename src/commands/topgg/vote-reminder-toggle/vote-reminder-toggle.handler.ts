import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../ICommandHandler';
import { Message, MessageEmbed } from 'discord.js';
import { VoteReminderService } from '../../../topgg/vote-reminder-service/vote-reminder.service';

const ON = 'on';
const OFF = 'off';

@Injectable()
export class VoteReminderToggleHandler implements ICommandHandler {
  constructor(private readonly voteReminderService: VoteReminderService) {}

  name = 'vote reminder toggle';
  description = 'subscribe or unsubscribe to the top.gg vote reminder';
  regex = new RegExp(`^colonie vote reminder (${ON}|${OFF})`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, onOrOff] = message.content.match(this.regex);

    const embed = new MessageEmbed();

    switch (onOrOff) {
      case ON:
        await this.voteReminderService.subscribe(message.author.id);
        embed.setColor('GREEN');
        embed.setDescription(
          'You will receive a DM when you can vote for colonie.',
        );
        break;
      case OFF:
        await this.voteReminderService.unsubscribe(message.author.id);
        embed.setColor('RED');
        embed.setDescription("You won't be bothered by our vote reminder...");
        break;
      default:
        throw new Error(`Invalid subscription direction`);
    }

    await message.author.send(embed);
  }
}
