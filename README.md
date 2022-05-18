<div align="center">
		<img src="https://github.com/helltf/helltfbot-v2/actions/workflows/build-test.yml/badge.svg">
</div>
<h1 align=center>Version 2 of my Twitchbot 🤖</h1>

# Tables of Content

- [How to get the bot](#how-to-get-the-bot)
- [Features](#features)
  * [How to interact](#how-to-interact)
  * [Commands](#commands)
- [Important libraries](#important-libraries)
  * [typeorm](#typeorm)
  * [typescript](#typescript)
  * [eslint](#eslint)
  * [tmi.js](#tmijs)
  * [jasmine](#jasmine)
- [Testing with jasmine](#testing-with-jasmine)
  * [Unit-Tests](#unit-tests)
  * [Integration-Tests](#integration-tests)
- [Associated repositories](#associated-repositories)
  * [[Website for the bot](https://github.com/helltf/bot-v2-website)](#-website-for-the-bot--https---githubcom-helltf-bot-v2-website-)
  * [[Backend API to access data from the bot](https://github.com/helltf/bot-v2-backend)](#-backend-api-to-access-data-from-the-bot--https---githubcom-helltf-bot-v2-backend-)


## How to get the bot

If you want the bot, use the command
```
~join me
```
in any of the connected channels.
Afterwards the bot should've joined and you can start interacting with the bot.
In case the bot is not responding to your messages, try to allow the messages with following command

```
~allow
```

If the bot is still not responding to your meessage, you can ask for help via [Twitch](https://twitch.tv/helltf) chat or [Discord](https://discord.com/channels/@me/296688575704072192) (hell#9902).

## Features

### How to interact with the bot
As you may have seen above, the bot will listen to every chat message starting with the prefix **~**.
Only in rare occurrences the bot will do something when sending messages without the prefix.
The bot will not respond to your message if it's not allowed to send message in the specific channel

### Commands

At the moment there is no way to lookup the existing commands other than inspecting the source code.
In the future you can see all existing commands on the website which will be linked in the [Associated repositories](#associated-repositories) part.
Each command existing has different attributes and can be issued either with the name or a registered alias.
After executing the command the bot will send a response including the status and the response message.
As a normal user you cannot access every command because of permissions which will be explained in the [permissions](###Permissions) section.

### Permissions
Each user has two different permissions assigned, which are **database permissions** and **chat permissions**.
Each level of permissions is associated with a numeric value, therefore the heigher the number, the heigher the level of permission is.
At the moment the Levels are structured as following

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
The permissionlevel of sub, vip, mod and broadcaster differ between the channels, therefore allowing specific user to execute commands only in specific channels.
Users with the dev or admin rule are allowed to almost execute every command anywhere.
Negative permissions are reserved for blocked users, to block anyone from interacting with the bot.

### Testing (TDD)
In this project I try to test as much of code as possible, because of missing tests in my Version 1 of my bot I can no longer maintain it.
Therefore I aim towards building a well maintained and developed project with this bot.
At the current state only unit- and integrationtests are implemented, which might be changed in the future.
Details about the tests can be found in the section [unit-tests](#unit-tests) and [integration-tests](#integration-tests)

### Database

The current database is a mariadb mysql database, which stores the information gathered by the bot.
In the future there might be an implementation of redis to store in memory data.

### CI-CD

Each pull request on the master or feature branch will run through 4 different jobs, to ensure the bot is working properly.
The complete pipeline consists of linting, building, unit-testing and integration-testing.
In case one of the job fails, the pipeline will conclude as failed.
Pull Request to the feature or master branch are required to pass all checks before merging.


## Important libraries

### tmi.js

### typeorm

[Typeorm](https://www.npmjs.com/package/typeorm) is used to interact with the database. 

### typescript

### eslint


### jasmine

## Testing with jasmine

### Unit-Tests

### Integration-Tests

## Install the bot yourself

## Associated repositories

### Website for the bot

The link to the repository is this one https://github.com/helltf/bot-v2-website and the page can be visited via following this link.
The framework for the website has not set yet.

### Backend API to access data from the bot
The source code of the API can be find [here](https://github.com/helltf/bot-v2-backend).
Language for the backend is not set yet.