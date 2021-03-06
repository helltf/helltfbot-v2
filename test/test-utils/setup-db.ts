import { getOrmConf } from '../../ormconfig'
import { TwitchBot } from '@client/bot'
import { CacheService } from '@service/cache.service'
import { DB } from '@src/db/export-repositories'

export const setupDatabase = async () => {
  globalThis.hb = new TwitchBot()
  hb.db = await new DB(getOrmConf()).initialize()
  hb.cache = await new CacheService().connect()
}

