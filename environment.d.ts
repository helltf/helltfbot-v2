declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'prod' | 'test'
      CLIENT_ID: string
      CLIENT_SECRET: string
      TWITCH_OAUTH: string
      PREFIX: string
      MAIN_USER: string
      DEBUG: 'false' | 'true'
      STARTUP_MESSAGE: string
      REDIS_URL: string
      MAIN_USER_ID: string
      DATABASE_URI: string
      TEST_DATABASE_URI: string
      ENCRYPT_KEY: string
      SEVENTV_GQL_TOKEN: string
      WEBHOOK_PORT: string
      WEBHOOK_SECRET: string
      BOT_CHANNEL: string
      GITHUB_TOKEN: string
    }
  }
}

export interface Environment {
  NODE_ENV: 'dev' | 'prod' | 'test'
  CLIENT_ID: string
  CLIENT_SECRET: string
  TWITCH_OAUTH: string
  PREFIX: string
  MAIN_USER: string
  DEBUG: 'false' | 'true'
  START_UP_MESSAGE: string
  REDIS_URL: string
  MAIN_USER_ID: string
  DATABASE_URI: string
  TEST_DATABASE_URI: string
  ENCRYPT_KEY: string
  SEVENTV_GQL_TOKEN: string
  WEBHOOK_PORT: string
  WEBHOOK_SECRET: string
  BOT_CHANNEL: string
  GITHUB_TOKEN: string
}
