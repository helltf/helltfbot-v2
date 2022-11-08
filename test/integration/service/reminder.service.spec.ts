import { ResourceSuccess } from "@api/types"
import { ReminderEntity } from "@db/entities"
import { ReminderCreationData, ReminderService } from "@src/services/reminder.service"
import { clearDb, clearRedis } from '@test-utils/clear'
import { disconnectDatabase, disconnectRedis } from '@test-utils/disconnect'
import {
  getExampleReminderEntity,
  getExampleTwitchUserEntity
} from '@test-utils/example'
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
      const creator = getExampleTwitchUserEntity({})
      const reciever = getExampleTwitchUserEntity({ id: 2 })
      const reminderData: ReminderCreationData = {
        creatorId: creator.id,
        recieverName: reciever.name,
        message: 'message',
        channel: 'channel'
      }
      await hb.db.user.save(creator)
      await hb.db.user.save(reciever)
      const result = await service.create(reminderData)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const savedEntity = await hb.db.reminder.findOneBy({ id })

      const expectedEntity: ReminderEntity = {
        id,
        creator,
        reciever
      }
      expect(savedEntity).toEqual(expectedEntity)
    })
  })
})
