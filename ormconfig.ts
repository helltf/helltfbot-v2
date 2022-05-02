import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Notification,Ban, Channel, ColorHistory, Timeout, TwitchUser, WatchChannel, WordleWord, CommandEntity, NotificationChannel } from './db/export-entities.js'

const {
	DB_HOST,
	DB_PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_DATABASE,
} = process.env

const env = process.env.NODE_ENV
const getOrmConf = (): MysqlConnectionOptions => {
	if (env === 'test') {
		return getTestOrmConf()
	}

	if (env === 'prod') {
	}

	return getDevOrmConf()
}
function getTestOrmConf(): MysqlConnectionOptions {
	return {
		type: 'mariadb',
		host: "192.168.178.27",
		port: 3333,
		username: 'root',
		password: 'test',
		database: 'twitch',
		synchronize: true,
		logging: false,
		entities: getEntities(),
		migrations: ['db/migrations/**/*.ts'],
		subscribers: ['db/subscriber/**/*.ts'],
	}
}
function getDevOrmConf(): MysqlConnectionOptions {
	return {
		type: 'mariadb',
		host: DB_HOST,
		port: Number(DB_PORT),
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_DATABASE,
		synchronize: false,
		logging: false,
		entities: ['dist/db/entity/**/*.js'],
		migrations: ['db/migrations/**/*.ts'],
		subscribers: ['db/subscriber/**/*.ts'],
	}
}

function getEntities(): any[]{
    return[
        Ban,
        Channel,
        ColorHistory,
        Timeout,
        TwitchUser,
        WatchChannel,
        WordleWord,
        CommandEntity,
        Notification,
        NotificationChannel
    ]
}
export { getOrmConf }
