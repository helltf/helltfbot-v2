import { BanTracking } from '../ban-tracking'
import { ColorTracking } from '../user-tracking'
import { TimeoutTracking } from '../timeout-tracking'
import { Module } from './module'
import { GameModule } from '../game.module'
const timeoutModule = new TimeoutTracking()
const colorModule = new ColorTracking()
const banModule = new BanTracking()
const gameModule = new GameModule()
const modules: Module[] = [timeoutModule, banModule, colorModule, gameModule]
export { modules }
