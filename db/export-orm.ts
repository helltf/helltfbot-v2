import { DataSource} from "typeorm";
import {typeormconf} from '../ormconfig.js'

console.log('sads')
export const AppDataSource = new DataSource(typeormconf)