import { BanTracking } from "@modules/ban.module";
import { GameModule } from "@modules/game.module";
import { TimeoutTracking } from "@modules/timeout.module";
import { Module } from '@modules/types'
import { UserTracking } from '@modules/user.module'
import { client } from '@src/client/main-client'
import { logger, LogType } from '@src/logger/logger-export'
import { getDeps } from 'deps'
import { PubSub } from './pubsub/pubsub'
import { ReminderModule } from './reminder.module'

const getModules = (): Module[] => {
  const deps = getDeps()

  return [
    new TimeoutTracking(deps.db, client),
    new UserTracking(deps.db, client),
    new BanTracking(deps.db, client),
    new GameModule(deps.db, client, deps.game),
    new ReminderModule(deps.db, client, deps.reminder, deps.utils),
    new PubSub()
  ]
}

export const initModules = async () => {
  const modules = getModules()
  for (const module of modules) {
    await module.initialize()
    logger.log(LogType.MODULE, `${module.name} has been initialized`)
  }

  logger.log(
    LogType.MODULE,
    `Successfully initialized ${modules.length} modules`
  )
}
