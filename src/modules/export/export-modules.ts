import { BanTracking } from '../ban.module'
import { ColorTracking } from '../user.module'
import { TimeoutTracking } from '../timeout.module'
import { Module } from './module'
import { GameModule } from '../game.module'
const timeoutModule = new TimeoutTracking()
const colorModule = new ColorTracking()
const banModule = new BanTracking()
const gameModule = new GameModule()
const modules: Module[] = [timeoutModule, banModule, colorModule, gameModule]
export { modules }
