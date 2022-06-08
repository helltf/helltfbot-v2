import 'dotenv/config'
import { DataSource } from 'typeorm'
import { getOrmConf } from './ormconfig'
const AppDataSource = new DataSource(getOrmConf())
export default AppDataSource
