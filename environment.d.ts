import { TwitchBot } from './bot'
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
      MAIN_USER: string
      DEBUG: 'false' | 'true'
      PIPELINE: 'false' | 'true'
      START_UP_MESSAGE: string
      REDIS_URL: string
      MAIN_USER_ID: string
      DATABASE_URI: string
      TEST_DATABASE_URI: string
      ENCRYPT_KEY: string
      SEVENTV_GQL_TOKEN: string
      WEBHOOK_PORT: string
      WEBHOOK_SECRET: string
    }
  }
}

export interface Environment {
  DATABASE_URI: string
  NODE_ENV: 'dev' | 'prod' | 'test'
  CLIENT_ID: string
  CLIENT_SECRET: string
  BEARERTOKEN_STREAMELEMENTS: string
  TWITCH_OAUTH: string
  GITHUB_TOKEN: string
  PREFIX: string
  MAIN_USER: string
  DEBUG: 'false' | 'true'
  START_UP_MESSAGE: string
  REDIS_URL: string
  MAIN_USER_ID: string
  TEST_DATABASE_URI: string
}
