# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added 

- remove command for removing notifications
- added redis connection for caching
- created unit tests for pubsub and pubsub connection
- proper dev setup
- added config service to get env variables

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