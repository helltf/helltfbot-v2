import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const getOrmConf = (): PostgresConnectionOptions => {
  validateEnv()

  if (process.env.NODE_ENV === 'test') {
    return getTestOrmConf()
  }

  return getDevOrmConf()
}

function validateEnv() {
  if (
    (process.env.NODE_ENV !== 'prod' && process.env.DB_DATABASE === 'twitch') ||
    process.env.TEST_DB_DATABASE !== 'test'
  )
    throw new Error('monkaS you sure?')
}

function getTestOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    host: process.env.TEST_DB_HOST,
    port: Number(process.env.TEST_DB_PORT),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    synchronize: true
  }
}

function getDevOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
}

function getDefaultOrmConf(): PostgresConnectionOptions {
  return {
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: ['dist/src/db/entity/**/*.js'],
    migrations: ['db/migrations/**/*.ts'],
    subscribers: ['db/subscriber/**/*.ts']
  }
}

export { getOrmConf }
