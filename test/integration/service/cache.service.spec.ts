import { clearRedis } from '../../test-utils/clear.js'
import { disconnectRedis } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test redis service', () => {
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectRedis()
  })

  it('test', async () => {
    await hb.cache.redis.set('a', 'b')

    const result = await hb.cache.redis.get('a')

    expect(result).toBe('b')
  })

  it('test', async () => {
    const result = await hb.cache.redis.get('a')

    expect(result).toBe(null)
  })
})
