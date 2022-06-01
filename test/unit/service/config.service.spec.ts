import { ConfigService } from "../../../src/service/config.service.js"

describe('test config service', () => {
  let service: ConfigService
  const cachedEnv = process.env

  beforeAll(() => {
    process.env = jasmine.createSpyObj({})
  })

  beforeEach(() => {
    service = new ConfigService()
  })

  afterAll(() => {
    process.env = cachedEnv
  })

  it('')
})
