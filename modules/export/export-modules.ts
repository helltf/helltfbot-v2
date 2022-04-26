import { banModule } from '../ban-tracking.js'
import { initializeColorTracking } from '../color-tracking.js'
import { liveTrackingModule } from '../live-tracking.js'
import { timeoutModule } from '../timeout-tracking.js'
import { Module } from './module.js'

const modules: Module[] = [timeoutModule, banModule, {initialize: initializeColorTracking}, liveTrackingModule]
export { modules }
