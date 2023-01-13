import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const getOrmConf = (): PostgresConnectionOptions => {
  if (process.env.NODE_ENV === 'test') {
    return getTestOrmConf()
  }

  return getDevOrmConf()
}

function getTestOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    synchronize: true,
    url: process.env.TEST_DATABASE_URI,
    migrationsRun: false
  }
}

function getDevOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    url: process.env.DATABASE_URI
  }
}

function getDefaultOrmConf(): PostgresConnectionOptions {
  return {
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: ['src/db/entities/**/*'],
    migrations: ['src/db/migration/**/*.ts'],
    subscribers: ['src/db/subscriber/**/*.ts'],
    migrationsRun: true,
    connectTimeoutMS: 10000
  }
}

export { getOrmConf }
