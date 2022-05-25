import 'dotenv/config'
import { DataSource } from 'typeorm'
import { getOrmConf } from '../../ormconfig.js'
import { TwitchBot } from '../../src/client/bot.js'
import { mainClient } from '../../src/client/main-bot.js'
import { DB } from '../../src/db/export-repositories.js'

const setupDatabase = async () => {
  globalThis.hb = new TwitchBot(mainClient)
  const src = new DataSource(getOrmConf())
  hb.db = await new DB(src).initialize()
}

export { setupDatabase }
