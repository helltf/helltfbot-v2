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
  wordleRepo: Repository<WordleWordEntity>
  colorRepo: Repository<ColorHistoryEntity>
  channelRepo: Repository<ChannelEntity>
  userRepo: Repository<TwitchUserEntity>
  banRepo: Repository<BanEntity>
  timeoutRepo: Repository<TimeoutEntity>
  commandRepo: Repository<CommandEntity>
  notificationRepo: Repository<NotificationEntity>
  notificationChannelRepo: Repository<NotificationChannelEntity>
  suggestionRepo: Repository<SuggestionEntity>
  errorRepo: Repository<ErrorEntity>
}

export class DB implements DbRepositories {
  wordleRepo: Repository<WordleWordEntity>
  colorRepo: Repository<ColorHistoryEntity>
  channelRepo: Repository<ChannelEntity>
  userRepo: Repository<TwitchUserEntity>
  banRepo: Repository<BanEntity>
  timeoutRepo: Repository<TimeoutEntity>
  commandRepo: Repository<CommandEntity>
  notificationRepo: Repository<NotificationEntity>
  notificationChannelRepo: Repository<NotificationChannelEntity>
  suggestionRepo: Repository<SuggestionEntity>
  dataSource: DataSource
  errorRepo: Repository<ErrorEntity>
  emoteStatsRepo: Repository<EmoteStatsEntity>

  constructor(config: PostgresConnectionOptions = getOrmConf()) {
    const dataSource = new DataSource(config)
    this.wordleRepo = dataSource.getRepository(WordleWordEntity)
    this.colorRepo = dataSource.getRepository(ColorHistoryEntity)
    this.channelRepo = dataSource.getRepository(ChannelEntity)
    this.userRepo = dataSource.getRepository(TwitchUserEntity)
    this.banRepo = dataSource.getRepository(BanEntity)
    this.timeoutRepo = dataSource.getRepository(TimeoutEntity)
    this.commandRepo = dataSource.getRepository(CommandEntity)
    this.notificationRepo = dataSource.getRepository(NotificationEntity)
    this.suggestionRepo = dataSource.getRepository(SuggestionEntity)
    this.notificationChannelRepo = dataSource.getRepository(
      NotificationChannelEntity
    )
    this.errorRepo = dataSource.getRepository(ErrorEntity)
    this.emoteStatsRepo = dataSource.getRepository(EmoteStatsEntity)
    this.dataSource = dataSource
  }
  async initialize(): Promise<DB> {
    await this.dataSource.initialize()
    return this
  }
}
