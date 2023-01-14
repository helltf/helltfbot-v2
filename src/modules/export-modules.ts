import { BanTracking } from "@modules/ban.module";
import { GameModule } from "@modules/game.module";
import { TimeoutTracking } from "@modules/timeout.module";
import { Module } from '@modules/types'
import { ColorTracking } from '@modules/user.module'
import { logger, LogType } from '@src/logger/logger-export'
import { ReminderModule } from './reminder.module'

const modules: Module[] = [
  new TimeoutTracking(),
  new ColorTracking(),
  new BanTracking(),
  new GameModule(),
  new ReminderModule()
]

export const initModules = async () => {
  for (const module of modules) {
    await module.initialize()
    logger.log(LogType.MODULE, `${module.name} has been initialized`)
  }

  logger.log(
    LogType.MODULE,
    `Successfully initialized ${modules.length} modules`
  )
}
