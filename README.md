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

### How to interact
As you may have seen above, the bot will listen to every chat message starting with the prefix **~**.
Only in rare occurrences the bot will do something when sending messages without the prefix.
The bot will not respond to your message if it's not allowed to send message in the specific channel

### Commands

At the moment there is no way to lookup the existing commands other than inspecting the source code.
In the future you can see all existing commands on the website which will be linked in the [Associated repositories](#associated-repositories) part.
Each command existing has different attributes and can be issued either with the name or a registered alias.
After executing the command the bot will send a response including the status and the response message.

### Testing and Testability

### Database

### CI-CD

## Important libraries

### typeorm

### typescript

### eslint

### tmi.js

### jasmine

## Testing with jasmine

### Unit-Tests

### Integration-Tests

## Associated repositories

### Website for the bot

The link to the repository is this one https://github.com/helltf/bot-v2-website and the page can be visited via following this link.
The framework for the website has not set yet.

### Backend API to access data from the bot
The source code of the API can be find [here](https://github.com/helltf/bot-v2-backend).
Language for the backend is not set yet.