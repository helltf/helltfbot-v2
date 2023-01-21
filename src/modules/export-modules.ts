import { BanTracking } from "@modules/ban.module";
import { GameModule } from "@modules/game.module";
import { TimeoutTracking } from "@modules/timeout.module";
import { Module } from '@modules/types'
import { UserTracking } from '@modules/user.module'
import { logger, LogType } from '@src/logger/logger-export'
import { ReminderModule } from './reminder.module'

const getModules = (): Module[] => {
  return [
    new TimeoutTracking(),
    new UserTracking(),
    new BanTracking(),
    new GameModule(),
    new ReminderModule()
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
