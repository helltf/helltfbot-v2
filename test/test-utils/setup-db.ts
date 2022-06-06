import { getOrmConf } from '../../ormconfig'
import { TwitchBot } from '../../src/client/bot'
import { DB } from '../../src/db/export-repositories'
import { CacheService } from '../../src/service/cache.service'

export const setupDatabase = async () => {
  globalThis.hb = new TwitchBot()
  hb.db = await new DB(getOrmConf()).initialize()
  hb.cache = await new CacheService().connect()
}

