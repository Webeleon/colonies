import { Injectable, Logger } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../ICommandHandler';
import { WORK_LIMIT_IN_MINUTES } from '../../game/limits.constants';
import { GENERAL_HELP_DESCRIPTION } from './help.constants';
import { leaderboardScopes } from '../leaderboard/leaderboard.handler';
import { leaderboardTopics } from '../../leaderboard/leaderboard.service';

@Injectable()
export class HelpHandler implements ICommandHandler {
  name = 'help';
  regex = new RegExp(`^colonie help( .*)?`, 'i');

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const [cmd, topic] = message.content.match(this.regex);
    if (topic && topic.toLowerCase().trim() === 'pvp') {
      await this.sendPvpHelp(message);
      return;
    }

    await this.sendHelp(message);
  }

  async sendHelp(message: Message): Promise<void> {
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Colonie help')
      .setDescription(GENERAL_HELP_DESCRIPTION)
      .addFields([
        {
          name: 'colonie resources',
          value: 'Display you colonie inventory',
        },
        {
          name: 'colonie troops',
          value: 'display your colonie troops',
        },
        {
          name: 'colonie recruit <troop type>',
          value: 'recruit the requested troop. `colonie recruit help` for more',
        },
        {
          name: 'colonie dismiss <troop type> <optional amount>',
          value: 'dismiss the troops',
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
          name: 'colonie leaderboard <topic(optional)>',
          value: `Display the top 10 players. available topics: ${Object.values(
            leaderboardTopics,
          )
            .map((x) => '`' + x + '`')
            .join(',')}`,
        },
        {
          name: 'colonie help <topic(optional)>',
          value: 'display the help message. Available topics: `pvp`',
        },
        {
          name: 'colonie invite',
          value: 'Send an invite link for this awesome bot!',
        },
      ]);

    await message.channel.send(embed);
  }

  async sendPvpHelp(message: Message): Promise<void> {
    const embed = new MessageEmbed().setColor('BLUE').setTitle('Colonie pvp')
      .setDescription(`Colonie is a PvP game allowing you to attack all the member of your server.

:crossed_swords:**pvp troops**:crossed_swords:
Find all the details on troops: \`colonie recruit help\`

:shield: *defensive* :shield:
- guards provide 1 defensive point to your colonie. They need to be fed daily or they will leave your colonie...

:archery:*offensive*:archery:

- light infantry provide 1 defensive point and 1 offensive point to your colonie.
They need to be paid in gold and fed daily! In addition, you need to have a barrak to recruit and train them.

:classical_building:**pvp buildings**:classical_building: 
Find all about buildings: \`colonie build help\`

:shield:*Defensive*:shield:

- pit trap grant 1 defensive point to your colonie.

:circus_tent:*Utilities*:circus_tent:

- barrak allow you to recruit infantry.
You will need to maintain this building daily with building materials.

:crossed_swords:**pvp raids**:crossed_swords:

If you have offensive troops (light infantry), you can launch attack on any member of the current server.

\`colonie raid @member\`

If you have more attack power than your victim you will get some golad and stole a percentage of the victim resources.

If the defender have more defense power than your attack. You will lose your offensive troops and the defender will get some gold.
Be careful, defense can be setted up in DM...`);

    await message.channel.send(embed);
  }
}
