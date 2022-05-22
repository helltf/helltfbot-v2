<div align="center">
		<img src="https://github.com/helltf/helltfbot-v2/actions/workflows/build-test.yml/badge.svg">
    <img src="https://badgen.net/npm/node/express">
    <img src= "https://img.shields.io/github/stars/helltf/helltfbot-v2.svg?style=social&label=Star&maxAge=2592000">
    <img src= "https://badgen.net/github/contributors/helltf/helltfbot-v2">
    <img src= "https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff">
</div>
<h1 align=center>Version 2 of my Twitchbot 🤖</h1>

# Tables of Content

- [How to get the bot](#how-to-get-the-bot)
- [Install the bot yourself](#install-the-bot-yourself)
- [Features](#features)
  * [How to interact with the bot](#how-to-interact-with-the-bot)
  * [Commands](#commands)
  * [Permissions](#permissions)
  * [Testing (TDD)](#testing--tdd-)
  * [Database](#database)
  * [CI-CD](#ci-cd)
- [Testing with jasmine](#testing-with-jasmine)
  * [Unit-Tests](#unit-tests)
  * [Integration-Tests](#integration-tests)
- [Important libraries](#important-libraries)
  * [tmi.js](#tmijs)
  * [typescript](#typescript)
  * [typeorm](#typeorm)
  * [jasmine](#jasmine)
- [Associated repositories](#associated-repositories)
  * [Website for the bot](#website-for-the-bot)
  * [Backend API to access data from the bot](#backend-api-to-access-data-from-the-bot)


## How to get the bot

If you want the bot, use the command
```
~join me
```
in any of the connected channels.
Afterwards you should be able interact with the bot in your channel.
In case the bot is not responding to your messages, you need to allow messages with the following command

```
~allow
```

If the bot is still not responding to your messages, you can ask for help via [Twitch](https://twitch.tv/helltf) or [Discord](https://discord.com/channels/@me/296688575704072192) (hell#9902).

## Install the bot yourself
To install the bot on your system start of with cloning the repository

```
git clone git@github.com:helltf/helltfbot-v2.git
```

Afterwards create an .env file, which will contain your secrets.
You can copy the following content into that file and fill in your secrets.

```
NODE_ENV=<env>
MAIN_USER=<your_username>
DEBUG=false
PREFIX=<bot_prefix>
START_UP_MESSAGE=[message]
DB_PORT=<db_port>
DB_HOST=<db_host>
DB_USERNAME=<db_username>
DB_PASSWORD=<db_password>
DB_DATABASE=<db_table>
TEST_DB_PORT=<test_db_port>
TEST_DB_HOST=<test_db_host>
TEST_DB_USERNAME=<test_db_username>
TEST_DB_PASSWORD=<test_db_password>
TEST_DB_DATABASE=<test_db_database>
CLIENT_ID=<twitch_client_id>
CLIENT_SECRET=<twitch_client_secret>
TWITCH_OAUTH=<twitch_client_oauth>
BEARERTOKEN_STREAMELEMENTS=<streamelements_api_key>
GITHUB_TOKEN=<github_api_key>
```

Next up install the dependencies for the project with 

```
npm install
```

If you don't have typescript globally installed, you can install it via

```
npm install -g typescript
```

And build the project with 

```
npm run build
```

If everything has gone right you can bootup the project with 

```
node .
```
You might get an error while requesting the github API, because you are not permitted to see the workflows of my other projects.

## Features

### How to interact with the bot
As you may have seen above, the bot will listen to every chat message starting with the prefix **~**.
Only in rare occurrences the bot will do something, when sending messages without the prefix.
No Responses will be send if the bot is not allowed to send messages.

### Commands

At the moment there is no possibility, to lookup all existing commands other than inspecting the source code.
In the future you can review the commands on the website which will be linked in the [Associated repositories](#associated-repositories) part.
Each command existing is configured differently and can be issued either with the name or a registered alias.
As a normal user you cannot access every command because due to permissions which will be explained in the [permissions](###Permissions) section.

### Permissions
Every user is assigned two different permissions, which are consisting of **database permissions** and **chat permissions**.
Each level of permissions is associated with a numeric value, therefore the heigher the number is, the heigher the level of permission is.
In the current state of the project the levels of permissions are structured as following

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

The permissions for a user inside the database defaults to 0, which corresponds to a normal user in twitch chat.
The permissionlevel of sub, vip, mod and broadcaster differs between channels, therefore allowing a specific user to execute commands only in specific channels.
Users with the dev or admin rule are allowed to almost execute every command anywhere.
Devs and admins are able to execute almost every command everywhere
Negative permissions are reserved for blocked users, to block anyone from interacting with the bot.

### Testing (TDD)
I aim towards building a well maintained and developed project with this bot.
AS a conclusion I try to test as much of the code as possible.
At the moment only unit- and integrationtests are implemented, which might be changed in the future.
Details about the tests can be found in the section [unit-tests](#unit-tests) and [integration-tests](#integration-tests)

### Database

Mariadb was the initial database for this project but has been changed to postgres.
Thus allowing to work with the diesel library in rust for the backend.
In the future there might be an implementation of redis to store in memory data.

### CI-CD

Each pull request on the master or feature branch will run through 4 different jobs.
The intire pipeline consists of linting, building, unit-testing and integration-testing.
In case one of the job fails, the pipeline will conclude as failed.
Pull Request on the feature or master branch are required to pass all checks before merging.

## Testing with jasmine

### Unit-Tests

Unit-tests are created inside the ./test/unit directory which contains all unit-tests for the entire project.
These tests are supposed to test small features or functions fairly quick and without any connection to other services.
Unit-tests should be prefered if possible.

### Integration-Tests

Integration-tests are aiming towards testing components in combination with other services, e.g. databases.
Those tests are created inside the ./test/integration dirctory.
To test the database properly I've a mariadb docker container running, which fullfills the purpose of being the test database.

## Important libraries

These are some of the important libraries, which are changing the way this application is created.

### tmi.js

[tmi.js](https://www.npmjs.com/package/tmi.js) is used to communicate with the twitch irc.

### typescript
[Typescript](https://www.npmjs.com/package/typescript) is used for strong typing and better scaling Javascript apps.

### typeorm

[Typeorm](https://www.npmjs.com/package/typeorm) is used to interact with the database and to avoid writing queries manually. 

### jasmine

[Jasmine](https://www.npmjs.com/package/jasmine) as mentioned [above](#testing-with-jasmine) jasmine is the test framework for this project.

## Associated repositories

### Website for the bot

You can find the repository for the website [here](https://github.com/helltf/bot-v2-website) and the link to the deployed page [here].
The framework for the website has not set yet.

### Backend API to access data from the bot
The source code of the API can be found [here](https://github.com/helltf/bot-v2-backend).
Language for the backend is not set yet.