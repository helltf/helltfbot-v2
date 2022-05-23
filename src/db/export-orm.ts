import { DataSource } from 'typeorm'
import { getOrmConf } from '../../ormconfig.js'

const config = getOrmConf()
export const AppDataSource = new DataSource(config)
