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
  EmoteStatsEntity,
  ReminderEntity
} from '@db/entities'
import { TwitchTokenEntity } from '@src/db/entities/twitch_token.entity'
import { DataSource, Repository } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { getOrmConf } from '../../ormconfig'
import { SystemReminderEntity } from './entities/system-reminder.entity'

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
  twitch_at: Repository<TwitchTokenEntity>
  reminder: Repository<ReminderEntity>
  systemReminder: Repository<SystemReminderEntity>
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
  twitch_at: Repository<TwitchTokenEntity>
  reminder: Repository<ReminderEntity>
  systemReminder: Repository<SystemReminderEntity>

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
    this.twitch_at = dataSource.getRepository(TwitchTokenEntity)
    this.reminder = dataSource.getRepository(ReminderEntity)
    this.systemReminder = dataSource.getRepository(SystemReminderEntity)
    this.dataSource = dataSource
  }
  async initialize(): Promise<DB> {
    await this.dataSource.initialize().catch(e => {
      throw new Error(e)
    })
    return this
  }
}
