import { ColorHistory } from "./db/entity/color_history.js"
import { WordleWord } from "./db/entity/wordle.js"
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions"
import { Channel } from "./db/entity/channel.js"
const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE} = process.env

const typeormconf: MysqlConnectionOptions = {
    type: 'mariadb',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    logging: false,
    "entities": [
        "dist/db/entity/**/*.js",
        ColorHistory,
        WordleWord,
        Channel
    ],
    "migrations": [
         "db/migrations/**/*.ts"
    ],
    "subscribers": [
        "db/subscriber/**/*.ts"
    ],
}

export {typeormconf}