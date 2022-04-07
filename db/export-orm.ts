import { DataSource} from "typeorm";
import {typeormconf} from '../ormconfig.js'

export const AppDataSource = new DataSource(typeormconf)