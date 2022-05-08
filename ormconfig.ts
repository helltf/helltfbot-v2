import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

const {
	DB_HOST,
	DB_PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_DATABASE,
	TEST_DB_PORT,
	TEST_DB_HOST,
	TEST_DB_USERNAME,
	TEST_DB_PASSWORD,
	TEST_DB_DATABASE,
} = process.env

const getOrmConf = (): MysqlConnectionOptions => {
	if (process.env.NODE_ENV == 'test') {
		return getTestOrmConf()
	}

	return getDevOrmConf()
}
function getTestOrmConf(): MysqlConnectionOptions {

	return {
		type: 'mariadb',
		host: TEST_DB_HOST,
		port: parseInt(TEST_DB_PORT),
		username: TEST_DB_USERNAME,
		password: TEST_DB_PASSWORD,
		database: TEST_DB_DATABASE,
		synchronize: true,
		logging: false,
		entities: ['dist/db/entity/**/*.js'],
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

export { getOrmConf }
