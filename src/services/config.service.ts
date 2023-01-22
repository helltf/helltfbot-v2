import { Environment } from "../../environment"

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

  get(key: keyof Environment): string | undefined {
    return process.env[key]
  }

  has(key: keyof Environment): boolean {
    return process.env[key] !== undefined
  }
}
