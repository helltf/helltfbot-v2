import { DataSource, Repository } from "typeorm";
import {typeormconf} from '../ormconfig.js'

const initDbRepositories = () => {
    return {

    }
}
export const AppDataSource = new DataSource(typeormconf)
export {initDbRepositories}
