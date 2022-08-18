import { ConfigService } from "@src/services/config.service"

describe('test config service', () => {
  let service: ConfigService
  const cachedEnv = process.env

  beforeEach(() => {
    service = new ConfigService()
    process.env = {} as any
  })

  afterAll(() => {
    process.env = cachedEnv
  })

  it('current node env is prod return true for isProd', () => {
    process.env['NODE_ENV'] = 'prod'

    expect(service.isProd()).toBe(true)
  })
  it('current node env is prod return false for isDev', () => {
    process.env['NODE_ENV'] = 'prod'

    expect(service.isDev()).toBe(false)
  })

  it('current node env is prod return false for isTest', () => {
    process.env['NODE_ENV'] = 'prod'

    expect(service.isTest()).toBe(false)
  })

  it('current node env is test return true for isTest', () => {
    process.env['NODE_ENV'] = 'test'

    expect(service.isTest()).toBe(true)
  })
  it('current node env is test return false for isDev', () => {
    process.env['NODE_ENV'] = 'test'

    expect(service.isDev()).toBe(false)
  })
  it('current node env is test return false for isProd', () => {
    process.env['NODE_ENV'] = 'test'

    expect(service.isProd()).toBe(false)
  })

  it('current node env is dev return true for isDev', () => {
    process.env['NODE_ENV'] = 'dev'

    expect(service.isDev()).toBe(true)
  })

  it('current node env is dev return false for isTest', () => {
    process.env['NODE_ENV'] = 'dev'

    expect(service.isTest()).toBe(false)
  })

  it('current node env is dev return false for isProd', () => {
    process.env['NODE_ENV'] = 'dev'

    expect(service.isProd()).toBe(false)
  })

  it('key is undefined in process.env has returns false', () => {
    const isExisting = service.has('NODE_ENV')

    expect(isExisting).toBe(false)
  })

  it('key is defined in process.env has returns true', () => {
    process.env.NODE_ENV = 'test'
    const isExisting = service.has('NODE_ENV')

    expect(isExisting).toBe(true)
  })

  it('key is undefined in process.env get returns undefined', () => {
    const nodeEnvValue = service.get('NODE_ENV')

    expect(nodeEnvValue).toBeUndefined()
  })

  it('key is defined in process.env has returns actual value', () => {
    const value = 'test'
    process.env.NODE_ENV = value

    const nodeEnvValuee = service.get('NODE_ENV')

    expect(nodeEnvValuee).toBe(value)
  })
})
