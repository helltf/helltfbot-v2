import { PubSub } from "@modules/pubsub/pubsub"
import { DB } from "@src/db/export-repositories"
import { logger, LogType } from "@src/logger/logger-export"
import { ApiService } from '@src/services/api.service'
import { CacheService } from '@src/services/cache.service'
import { ConfigService } from '@src/services/config.service'
import { GameService } from '@src/services/game.service'
import { NotificationService } from '@src/services/notification.service'
import { ReminderService } from '@src/services/reminder.service'
import { Utility } from '@src/utilities/utility'

const deps = {
  db: new DB(),
  utils: new Utility(),
  api: new ApiService(),
  cache: new CacheService(),
  config: new ConfigService(),
  game: new GameService(),
  notification: new NotificationService(),
  reminder: new ReminderService(),
  pubsub: new PubSub()
}

export const initDeps = async () => {
  logger.log(LogType.INFO, 'Initializing...')
  await deps.db.initialize()
  logger.log(LogType.INFO, 'DB connected')

  await deps.cache.connect()
  logger.log(LogType.INFO, 'Cache initialized')

  await deps.api.init()
  logger.log(LogType.INFO, 'API initialized')

  await deps.pubsub.initialize()
  logger.log(LogType.TWITCHBOT, 'Successfully initialized')
}

export const getDeps = () => {
  return deps
}
