
import { BanTracking } from './ban.module'
import { GameModule } from './game.module'
import { ReminderModule } from './reminder.module'
import { TimeoutTracking } from './timeout.module'
import { Module } from './types'
import { ColorTracking } from './user.module'

export const modules: Module[] = [
  new TimeoutTracking(),
  new ColorTracking(),
  new BanTracking(),
  new GameModule(),
  new ReminderModule()
]
