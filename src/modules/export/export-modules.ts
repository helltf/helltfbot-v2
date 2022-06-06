import { BanTracking } from '../ban-tracking.js'
import { ColorTracking } from '../user-tracking.js'
import { TimeoutTracking } from '../timeout-tracking.js'
import { Module } from './module.js'
import { GameModule } from '../game.module.js'
const timeoutModule = new TimeoutTracking()
const colorModule = new ColorTracking()
const banModule = new BanTracking()
const gameModule = new GameModule()
const modules: Module[] = [timeoutModule, banModule, colorModule, gameModule]
export { modules }
