import { DataSource, Repository } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { getOrmConf } from '../../ormconfig.js'
import {
  WordleWord,
  ColorHistory,
  Channel,
  TwitchUser,
  Ban,
  Timeout,
  CommandEntity,
  Notification,
  NotificationChannel,
  Suggestion
} from './export-entities.js'

export interface DbRepositories {
  wordleRepo: Repository<WordleWord>
  colorRepo: Repository<ColorHistory>
  channelRepo: Repository<Channel>
  userRepo: Repository<TwitchUser>
  banRepo: Repository<Ban>
  timeoutRepo: Repository<Timeout>
  commandRepo: Repository<CommandEntity>
  notificationRepo: Repository<Notification>
  notificationChannelRepo: Repository<NotificationChannel>
  suggestionRepo: Repository<Suggestion>
}

export class DB implements DbRepositories {
  wordleRepo: Repository<WordleWord>
  colorRepo: Repository<ColorHistory>
  channelRepo: Repository<Channel>
  userRepo: Repository<TwitchUser>
  banRepo: Repository<Ban>
  timeoutRepo: Repository<Timeout>
  commandRepo: Repository<CommandEntity>
  notificationRepo: Repository<Notification>
  notificationChannelRepo: Repository<NotificationChannel>
  suggestionRepo: Repository<Suggestion>
  dataSource: DataSource

  constructor(config: PostgresConnectionOptions = getOrmConf()) {
    const dataSource = new DataSource(config)
    this.wordleRepo = dataSource.getRepository(WordleWord)
    this.colorRepo = dataSource.getRepository(ColorHistory)
    this.channelRepo = dataSource.getRepository(Channel)
    this.userRepo = dataSource.getRepository(TwitchUser)
    this.banRepo = dataSource.getRepository(Ban)
    this.timeoutRepo = dataSource.getRepository(Timeout)
    this.commandRepo = dataSource.getRepository(CommandEntity)
    this.notificationRepo = dataSource.getRepository(Notification)
    this.suggestionRepo = dataSource.getRepository(Suggestion)
    this.notificationChannelRepo = dataSource.getRepository(NotificationChannel)

    this.dataSource = dataSource
  }
  async initialize(): Promise<DB> {
    await this.dataSource.initialize()
    return this
  }
}
