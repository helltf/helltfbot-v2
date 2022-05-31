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

  get(key: keyof NodeJS.ProcessEnv): string | undefined {
    return process.env[key]
  }

  has(key: keyof NodeJS.ProcessEnv): boolean {
    return process.env[key] !== undefined
  }
}

