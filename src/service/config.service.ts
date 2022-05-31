export class ConfigService {
  isProd() {
    return process.env.NODE_ENV === 'prod'
  }

  isDev() {
    return process.env.NODE_ENV === 'dev'
  }

  isTest() {
    return process.env.NODE_ENV === 'test'
  }
}
