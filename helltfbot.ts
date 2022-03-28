import 'dotenv/config'
import { getMainClientConfig } from './config/config.js'
import * as tmi from 'tmi.js'

let config = getMainClientConfig()

console.log(config)