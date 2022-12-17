# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- coinflip command

## [1.4.2](https://github.com/helltf/helltfbot-v2/releases/tag/v1.4.2) - 2022-12-04

### Added 

- Command to check recorded bans
- Reminder system for system and user reminders
- Create reminder on suggestion update

### Fixed

- Branch was undefined if workflow was not on master

## [1.4.1](https://github.com/helltf/helltfbot-v2/releases/tag/v1.4.1) - 2022-11-11

### Added

- notification on suggestion update

### Changed

- github pipeline updates uses webhook
- updated debug logs

## [1.4.0](https://github.com/helltf/helltfbot-v2/releases/tag/v1.4.0) - 2022-10-13

### Added 

- deny command to deny suggestions
- unit tests for yoink command
- unit tests for alias command

### Changed

- [BREAKING CHANGE] go over to jest instead of jasmine

### Fixed

- ping no longer sends multiple messages

## [1.3.1](https://github.com/helltf/helltfbot-v2/releases/tag/v1.3.1) - 2022-08-18

### Added

- generate random hex codes
- parse emote urls for removing emotes
- parse emote urls for adding emotes
- unit tests for removing emotes
- unit tests for adding emotes
- command to check amount of moderators
- command for generating random colors

### Changed

- using yarn instead of npm

## [1.3.0](https://github.com/helltf/helltfbot-v2/releases/tag/v1.3.0) - 2022-08-11

### Added

- command to get color history
- command to show timeout stats
- decryption of saved access token
- command to set level of user
- command to update status of suggestion
- save current status of suggestions
- adding 7tv emotes
- removing 7tv emotes
- yoinking 7tv emotes
- commands.md to show commands 
- command to set alias for emote

### Changed 
- Removing repo from global db object

## [1.2.2](https://github.com/helltf/helltfbot-v2/releases/tag/v1.2.2) - 2022-07-01

### Added

- global utils functions
- hot reload for dev
- emote command to fetch all emotes for channel
- save emotegame results as stats
- commands can now be run via whispers
- help command to display information about a command
- eval command for better debugging
- stats command to show saved emotegame stats

### Changed

- remove channel from Response
- use database-url instead of single params
- ping command returns more information
- response can be string array or string now

### Fix

- no longer sending letters after word has been guessed

## [1.2.1](https://github.com/helltf/helltfbot-v2/releases/tag/v1.2.1) - 2022-06-08

### Added 

- Emotegame command
- integration tests with redis
- saving occurred errors to db

### Changed

- Using ts-node instead of node
- setup correct path lookup with ts

## [1.2.0](https://github.com/helltf/helltfbot-v2/releases/tag/v1.2.0) - 2022-06-03

### Added 

- remove command for removing notifications
- added redis connection for caching
- created unit tests for pubsub and pubsub connection
- proper dev setup
- added config service to get env variables
- increment command counter after execution

### Fixed

- Admins no longer get cooldowns on commands
- Using jasmine clock instead of setTimeout in tests
- avoid crash if a new user sends a message
- cleardb no longer works in prod

### Changed 

- commands are now classes thus providing better testability
- jasmine tests are now running from script
- announce pipeline fixes instead of successfull runs

## [1.1.1](https://github.com/helltf/helltfbot-v2/releases/tag/v1.1.1) - 2022-05-27

### Added 

- Use docker compose for building and deployment
- Typescript as devDependency

### Changed 

- join channels upon connecting
- Moved source files into src directory
- updated database info text in readme 
- join all pubsub topics at once
- removed watchclient

### Fixed 

- new connection after creating a new notification

## [1.1.0](https://github.com/helltf/helltfbot-v2/releases/tag/v1.1.0) - 2022-05-21

### Added
- hotfix add .dockerignore
- join own channel 
- leave own channel
- allow command

### Changed

- go from mysql to postgres
- new ApiModule to bundle Apis

## [1.0.0](https://github.com/helltf/helltfbot-v2/releases/tag/v1.0.0) - 2022-05-21

### Added

- Github command
- join command
- leave command
- notify command
- ping command
- rmsuggestion command
- website command
- suggest command
- Mysql database
- Twitch client connection
- Github Api
- Twitch Api
- Unit and Integration-Tests for commands
- ban tracking 
- color tracking 
- timeout tracking 
- addeed github pipeline job
- pubsub client connection
- Permissionssystem
- Aliassystem
- CI pipeline
