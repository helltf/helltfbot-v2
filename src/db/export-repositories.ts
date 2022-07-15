import {
  WordleWordEntity,
  ColorHistoryEntity,
  ChannelEntity,
  TwitchUserEntity,
  BanEntity,
  TimeoutEntity,
  CommandEntity,
  NotificationEntity,
  NotificationChannelEntity,
  SuggestionEntity,
  ErrorEntity,
  EmoteStatsEntity
} from '@db/entities'
import { DataSource, Repository } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { getOrmConf } from '../../ormconfig'

export interface DbRepositories {
  wordle: Repository<WordleWordEntity>
  color: Repository<ColorHistoryEntity>
  channel: Repository<ChannelEntity>
  user: Repository<TwitchUserEntity>
  ban: Repository<BanEntity>
  timeout: Repository<TimeoutEntity>
  command: Repository<CommandEntity>
  notification: Repository<NotificationEntity>
  notificationChannel: Repository<NotificationChannelEntity>
  suggestion: Repository<SuggestionEntity>
  error: Repository<ErrorEntity>
}

export class DB implements DbRepositories {
  wordle: Repository<WordleWordEntity>
  color: Repository<ColorHistoryEntity>
  channel: Repository<ChannelEntity>
  user: Repository<TwitchUserEntity>
  ban: Repository<BanEntity>
  timeout: Repository<TimeoutEntity>
  command: Repository<CommandEntity>
  notification: Repository<NotificationEntity>
  notificationChannel: Repository<NotificationChannelEntity>
  suggestion: Repository<SuggestionEntity>
  dataSource: DataSource
  error: Repository<ErrorEntity>
  emoteStats: Repository<EmoteStatsEntity>

  constructor(config: PostgresConnectionOptions = getOrmConf()) {
    const dataSource = new DataSource(config)
    this.wordle = dataSource.getRepository(WordleWordEntity)
    this.color = dataSource.getRepository(ColorHistoryEntity)
    this.channel = dataSource.getRepository(ChannelEntity)
    this.user = dataSource.getRepository(TwitchUserEntity)
    this.ban = dataSource.getRepository(BanEntity)
    this.timeout = dataSource.getRepository(TimeoutEntity)
    this.command = dataSource.getRepository(CommandEntity)
    this.notification = dataSource.getRepository(NotificationEntity)
    this.suggestion = dataSource.getRepository(SuggestionEntity)
    this.notificationChannel = dataSource.getRepository(
      NotificationChannelEntity
    )
    this.error = dataSource.getRepository(ErrorEntity)
    this.emoteStats = dataSource.getRepository(EmoteStatsEntity)
    this.dataSource = dataSource
  }
  async initialize(): Promise<DB> {
    await this.dataSource.initialize()
    return this
  }
}
