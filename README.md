
# Game Commands

## Resources

2 types of resources exist in the game:

- `food` used to recruit troops and in scavenging work
- `building materials` used to build buildings

### `colonie resources`

display the colonie resources

## troops

### `colonie troops`

display colonie troops

### `colonie recruit <troop type> `

recruit the requested troop or display the recruitement help 

- `gatherer` produce 1 food
- `scavenger` consume 1 food and produce a building material

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

## Other commands

### `!invite`

display a bot invite link

### `!status`

display the bot status

### `!ping`

reply pong

### `!help`

display the help message.

# Developer
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Actions Status](https://github.com/bassochette/colonies/workflows/Testing/badge.svg)](https://github.com/bassochette/colonies/actions)

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
