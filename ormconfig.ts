import { WordleWord } from "./db/entity/wordle.js"
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions"
const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE} = process.env

const typeormconf: MysqlConnectionOptions = {
    type: 'mariadb',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    // "entities": [
    //     "db/entity/**/*.ts"
    // ],
    "entities":
        [WordleWord],
    "migrations": [
         "db/migrations/**/*.ts"
    ],
    "subscribers": [
        "db/subscriber/**/*.ts"
    ],
}

console.log(WordleWord)

export {typeormconf}