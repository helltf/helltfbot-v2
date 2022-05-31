import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const getOrmConf = (): PostgresConnectionOptions => {
  if (hb.config.isTest()) {
    return getTestOrmConf()
  }

  return getDevOrmConf()
}
function getTestOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    host: hb.config.get('TEST_DB_HOST'),
    port: Number(hb.config.get('TEST_DB_PORT')),
    username: hb.config.get('TEST_DB_USERNAME'),
    password: hb.config.get('TEST_DB_PASSWORD'),
    database: hb.config.get('TEST_DB_DATABASE'),
    synchronize: true
  }
}

function getDevOrmConf(): PostgresConnectionOptions {
  const defaultConf = getDefaultOrmConf()
  return {
    ...defaultConf,
    host: hb.config.get('DB_HOST'),
    port: Number(hb.config.get('DB_PORT')),
    username: hb.config.get('DB_USERNAME'),
    password: hb.config.get('DB_PASSWORD'),
    database: hb.config.get('DB_DATABASE')
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
