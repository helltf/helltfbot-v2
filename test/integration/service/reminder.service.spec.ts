import { ReminderService } from "@src/services/reminder.service"
import { clearDb, clearRedis } from "@test-utils/clear"
import { disconnectDatabase, disconnectRedis } from "@test-utils/disconnect"
import { setupDatabase } from '@test-utils/setup-db'

describe('reminder service', () => {
  let service: ReminderService

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    service = new ReminderService()
    await clearDb()
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectRedis()
    await disconnectDatabase()
  })

  describe('create reminder', () => {
    it('create function saves new reminder in database', async () => {
      const channel = 'channel'
      const user = getExampleTwitchUserState({})
    })
  })
})
