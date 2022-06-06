import { TwitchBot } from './src/client/bot'
declare global {
  var hb: TwitchBot
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'prod' | 'test'
      CLIENT_ID: string
      CLIENT_SECRET: string
      BEARERTOKEN_STREAMELEMENTS: string
      TWITCH_OAUTH: string
      GITHUB_TOKEN: string
      PREFIX: string
      DB_PORT: string
      DB_HOST: string
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_DATABASE: string
      MAIN_USER: string
      DEBUG: 'false' | 'true'
      TEST_DB_PORT: string
      TEST_DB_HOST: string
      TEST_DB_USERNAME: string
      TEST_DB_PASSWORD: string
      TEST_DB_DATABASE: string
      PIPELINE: 'false' | 'true'
      START_UP_MESSAGE: string
      REDIS_URL: string
      MAIN_USER_ID: string
    }
  }
}

export interface Environment {
  NODE_ENV: 'dev' | 'prod' | 'test'
  CLIENT_ID: string
  CLIENT_SECRET: string
  BEARERTOKEN_STREAMELEMENTS: string
  TWITCH_OAUTH: string
  GITHUB_TOKEN: string
  PREFIX: string
  DB_PORT: string
  DB_HOST: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_DATABASE: string
  MAIN_USER: string
  DEBUG: 'false' | 'true'
  TEST_DB_PORT: string
  TEST_DB_HOST: string
  TEST_DB_USERNAME: string
  TEST_DB_PASSWORD: string
  TEST_DB_DATABASE: string
  START_UP_MESSAGE: string
  REDIS_URL: string
  MAIN_USER_ID: string
}
