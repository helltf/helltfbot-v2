import { BanTracking } from '../ban.module'
import { ColorTracking } from '../user.module'
import { TimeoutTracking } from '../timeout.module'
import { Module } from './module'
import { GameModule } from '../game.module'

export const modules: Module[] = [
  new TimeoutTracking(),
  new ColorTracking(),
  new BanTracking(),
  new GameModule()
]

