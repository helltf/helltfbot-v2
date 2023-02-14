import { PubSub } from '@modules/pubsub/pubsub'
import { DB } from '@src/db/export-repositories'
import { ApiService } from '@src/services/api.service'
import { CacheService } from '@src/services/cache.service'
import { GameService } from '@src/services/game.service'
import { NotificationService } from '@src/services/notification.service'
import { ReminderService } from '@src/services/reminder.service'
import { Utility } from '@src/utilities/utility'
import { CommandDependencies } from 'deps'
import { Client } from 'tmi.js'

export function createTestDeps() {
  return {
    db: new DB(),
    utils: new Utility(),
    api: new ApiService(),
    cache: new CacheService(),
    game: new GameService(),
    notification: new NotificationService(),
    reminder: new ReminderService(),
    pubSub: new PubSub(),
    client: {} as Client
  } as CommandDependencies
}
