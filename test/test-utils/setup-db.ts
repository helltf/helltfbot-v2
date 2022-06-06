import { getOrmConf } from '../../ormconfig.js'
import { TwitchBot } from '../../src/client/bot.js'
import { DB } from '../../src/db/export-repositories.js'
import { CacheService } from '../../src/service/cache.service.js'

export const setupDatabase = async () => {
  globalThis.hb = new TwitchBot()
  hb.db = await new DB(getOrmConf()).initialize()
  hb.cache = await new CacheService().connect()
}

