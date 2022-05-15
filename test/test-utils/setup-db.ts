import 'dotenv/config'
import { DataSource } from 'typeorm'
import { TwitchBot } from '../../client/bot.js'
import { mainClient } from '../../client/main-bot.js'
import { watchClient } from '../../client/track-bot.js'
import { DB } from '../../db/export-repositories.js'
import { getOrmConf } from '../../ormconfig.js'

const setupDatabase = async () => {
  globalThis.hb = new TwitchBot(mainClient, watchClient)
  const src = new DataSource(getOrmConf())
  hb.db = await new DB(src).initialize()
}

export { setupDatabase }
