import { BanTracking } from "@modules/ban.module";
import { GameModule } from "@modules/game.module";
import { TimeoutTracking } from "@modules/timeout.module";
import { Module } from '@modules/types'
import { ColorTracking } from '@modules/user.module'
import { ReminderModule } from './reminder.module'

export const modules: Module[] = [
  new TimeoutTracking(),
  new ColorTracking(),
  new BanTracking(),
  new GameModule(),
  new ReminderModule()
]
