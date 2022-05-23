import { BanTracking } from '../ban-tracking.js'
import { ColorTracking } from '../color-tracking.js'
import { TimeoutTracking } from '../timeout-tracking.js'
import { Module } from './module.js'
const timeoutModule = new TimeoutTracking()
const colorModule = new ColorTracking()
const banModule = new BanTracking()
const modules: Module[] = [timeoutModule, banModule, colorModule]
export { modules }
