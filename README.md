<div align="center">
    <img src="https://github.com/helltf/helltfbot-v2/actions/workflows/build-test.yml/badge.svg">
    <img src="https://badgen.net/npm/node/express">
    <img src= "https://img.shields.io/github/stars/helltf/helltfbot-v2.svg?style=social&label=Star&maxAge=2592000">
    <img src= "https://badgen.net/github/contributors/helltf/helltfbot-v2">
    <img src= "https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff">
</div>
<h1 align=center>2nd version of my Twitchbot 🤖</h1>

# Tables of Content

- [Add the bot to your channel](#add-the-bot-to-your-channel)
- [Run the bot yourself](#run-the-bot-yourself)
- [About the bot](#about-the-bot)
  * [Chat Interaction](#chat-interaction)
  * [Commands](#commands)
  * [Permissions](#permissions)
- [Development](#development)
  * [Database](#database)
  * [CI-CD](#ci-cd)
  * [Testing](#testing-\(tdd\))
- [Important libraries](#important-libraries)
- [Related repositories](#related-repositories)
  * [Website](#website)
  * [Backend API](#backend-api)


## Add the bot to your channel

To add the bot to your channel, use the command
```
~join me
```
in any of the connected channels.

The bot should now trigger on sending commands in your own chat. If there is no response to your messages, you may need to allow sending messages by using another command in your own chat:

```
~allow
```

If the bot is still not responding, ask for help via [Twitch](https://twitch.tv/helltf) or [Discord](https://discord.com/channels/@me/296688575704072192) (hell#9902).

## Run the bot yourself
Clone the repository to your own local system:

```
git clone git@github.com:helltf/helltfbot-v2.git && cd helltfbot-v2
```

Create a .env file at the root of the newly created directory, which will be used to store sensitive and environment specific configuration options.

Copy the following snippet into that file and fill in your own values:

``` sh
NODE_ENV=<env>
MAIN_USER=<your_username>
MAIN_USER_ID=<your_user_id>
DEBUG=<bool>
PREFIX=<bot_prefix>
START_UP_MESSAGE=[message]
DB_USERNAME=<db_username>
DB_PASSWORD=<db_password>
DB_DATABASE=<db_table>
DATABASE_URI=<db_connection_uri>
TEST_DATABASE_URI=<test_db_connection_uri>
CLIENT_ID=<twitch_client_id>
CLIENT_SECRET=<twitch_client_secret>
TWITCH_OAUTH=<twitch_client_oauth>
BEARERTOKEN_STREAMELEMENTS=<streamelements_api_key>
GITHUB_TOKEN=<github_api_key>
REDIS_URL=<redis_db_url>
SEVENTV_GQL_TOKEN= <7tv-Bearer>
ENCRYPT_KEY=<key_to_encrypt>
```

Install all dependencies using ```yarn install``` and build the project with ```yarn build```, then if nothing went wrong, you can now run the bot:

```
yarn start
```
You might encounter an error while querying the GitHub API, since you are not permitted to see details of GitHub Actions on my other projects.

## About the bot

### Chat Interaction
The bot will listen to every chat message starting with the prefix ```~```, there are rare exceptions where the bot might react to messages without that prefix. No response will be sent if the bot is not allowed to send messages.

### Commands

Right now there is a small list containing all available commands. See [here](https://github.com/helltf/helltfbot-v2/blob/master/Commands.md)
In the future there will be a documented list of commands on the [associated website](#website).

Every existing command has its own separate configuration and can be called either by its name or registered aliases. Some commands are exclusive to roles with higher [permission levels](#permissions).

### Permissions
Each user has two different permission levels, of which one regulates the users **database permissions** and the other one his **chat permissions**. The level of access is indicated by a numeric value, the higher the number, the more access any given user has. Possible values at the moment are the following:

```
BLOCKED = -1
USER = 0
SUB = 1
VIP = 2
MOD = 3
BROADCASTER = 4
DEV = 5
ADMIN = 100
```

Access level for any user inside of the database always defaults to 0, while the chat permissions of a user are automatically set to either USER, SUB, VIP, MOD or BROADCASTER depending on his role in a given twitch chat. Therefore permissions of a single user can vary between different chats.  
Users with the DEV or ADMIN role are permitted to execute most/all commands in any chat, while negative permissions are reserved for blocked users, preventing someone from interacting with the bot at all.

## Development

### Database

Mariadb was the initial database for this project but has been changed to postgres.
Thus allowing to work with the diesel library in rust for the backend.

An additional Redis layer has been added in v1.2.0 to store very frequently accessed data in-memory.

### CI-CD

Every push to the ```feature``` or ```master``` branches, as well as any pull request will trigger a workflow of 4 jobs, consisting of linting, building, unit-testing and integration-testing. Pull requests on ```feature``` or ```master``` are required to pass all checks before merging.

### Testing (TDD)
My aim for this is towards building a maintainable and well-developed project, which is why I have chosen to try following test-driven development using [Jasmine](https://www.npmjs.com/package/jasmine) and cover as much of the code as possible with tests. At this point there are only unit and integration tests implemented, something that might change in the future.

#### Unit Tests

All unit tests for this project are stored inside of ```./test/unit```. They are supposed to test small features/functions fairly quickly and without any connection to outside services and should be the preferred method for testing if possible.

#### Integration Tests

Integration tests are testing components and their connection to other services, e.g. a database. They are stored inside of ```./test/integration```. To test properly against a database I am running a MariaDB docker container, containing a suitable test database.

## Important libraries

These are some of the important libraries used, changing how this project is developed or making it possible in the first place.

### tmi.js

[tmi.js](https://www.npmjs.com/package/tmi.js) is used to communicate with the twitch IRC server.

### typescript
[TypeScript](https://www.npmjs.com/package/typescript) provides strong typing for scalable JavaScript apps.

### typeorm

[TypeORM](https://www.npmjs.com/package/typeorm) acts as an abstraction layer between the application and the database, to avoid writing manual SQL queries.

### jasmine

[Jasmine](https://www.npmjs.com/package/jasmine) is, [as mentioned above](#testing-with-jasmine), the test framework used for this project.

## Related repositories

### Website

The bot will have an associated website used for things like a command list. There is a [repository](https://github.com/helltf/bot-v2-website) created for it already, but the entire project is still in progress.

### Backend API

I am also working on a [rust backend](https://github.com/helltf/bot-v2-backend) to provide an API for querying data collected by the bot.
