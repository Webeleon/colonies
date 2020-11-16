# Game Commands

## Player Versus Player

Colonie is a PvP game allowing you to attack all the member of your server.

### pvp troops
Find all the details on troops: `colonie recruit help`
#### defensive

- `guards` provide 1 defensive point to your colonie. They need to be fed daily or they will leave your colonie...

#### offensive

- `light infantry` provide 1 defensive point and 1 offensive point to your colonie. 
They need to be paid in gold and fed daily! In addition, you need to have a `barrak` to recruit and train them.

### pvp buildings
Find all about buildings: `colonie build help`
#### Defensive

- `pit trap` grant 1 defensive point to your colonie.

#### Utilities

- `barrak` allow you to recruit infantry. 
You will need to maintain this building daily with building materials.

### pvp raids

If you have offensive troops (`light infantry`), you can launch attack on any member of the current server.

`colonie raid @member`

If you have more attack power than your victim you will get some golad and stole a percentage of the victim resources.

If the defender have more defense power than your attack. You will lose your offensive troops and the defender will get some gold.
Be careful, defense can be setted up in DM...

## Resources

3 types of resources exist in the game:

- `food` used to recruit troops and in scavenging work
- `building materials` used to build buildings
- `gold` used to pay the military

### `colonie resources`

display the colonie resources

## troops

### `colonie troops`

display colonie troops

### `colonie recruit <troop type> `

recruit the requested troop or display the recruitement help 

- `gatherer` produce 1 food
- `scavenger` consume 1 food and produce a building material
- `guards` add +1 defense point to the colonie :warning: require a daily upkeep cost :warning:
- `light infantry` add + 1 defense and +1 attack to the colonie :warning: require a daily upkeep cost :warning:

### `colonie work`

Activate the workers to produce their designated yeild.

## buildings

Building will create a passive income for you colonie. You will receive a DM from the bot twice a day at 0000 and 1200 (server time).

### `colonie buildings` 

list colonie building

### `colonie build <building type>` 

build the requested building or display the help on invalid types

- `home` allow 5 more troops (not applied yet)
- `farms` produce 5 food a 0000 and 12000
- `landfill` produce 5 building material at 0000 and 1200
- `barrak` allow you to recruit infantry :warning: require a daily upkeep cost :warning:
- `pit trap` grant +1 DEF for the colonie

## Other commands

### `colonie invite`

display a bot invite link

### `colonie status`

display the bot status

### `colonie ping`

reply pong

### `colonie help`

display the help message.

# Developer
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Actions Status](https://github.com/bassochette/colonies/workflows/Testing/badge.svg)](https://github.com/bassochette/colonies/actions)
[![Coverage Status](https://coveralls.io/repos/github/bassochette/colonies/badge.svg?branch=master)](https://coveralls.io/github/bassochette/colonies?branch=master)

## Endpoints

- [GET] `/` `/health`
Health check, should always return OK

- [GET] /discord/bot-invite
helper method that redirect to the bot invite link

## Installation

```bash
$ npm install
```

## Environnement variables

.env files supported

- PORT : default 5000
- DISCORD_API_TOKEN
- DISCORD_CLIENT_ID
- MONGO_URL

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app in docker

To start the container, run:

```
$ docker-compose up
```

When it run, go to: `http://localhost:5000/health` 


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Built with

- [Nest](https://github.com/nestjs/nest) framework TypeScript.
- [discord.js](https://discord.js.org/#/) discord API client.
