import { ResourceError, ResourceSuccess } from "@api/types"
import { ReminderEntity } from "@db/entities"
import { ReminderStatus } from "@src/db/entities/reminder.entity"
import {
  ReminderCreationData,
  ReminderService
} from '@src/services/reminder.service'
import { clearDb, clearRedis } from '@test-utils/clear'
import { disconnectDatabase, disconnectRedis } from '@test-utils/disconnect'
import {
  getExampleReminderEntity,
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
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
    it('creator does not exist return resource error', async () => {
      const reminderData: ReminderCreationData = {
        creatorId: 1,
        recieverName: 'user2',
        message: 'message',
        channel: 'channel'
      }
      const result = await service.create(reminderData)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('Creator does not exist')
    })

    it('reciever does not exist return resource error', async () => {
      const creator = getExampleTwitchUserEntity({})
      const reminderData: ReminderCreationData = {
        creatorId: 1,
        recieverName: 'user2',
        message: 'message',
        channel: 'channel'
      }
      await hb.db.user.save(creator)

      const result = await service.create(reminderData)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('Reciever does not exist')
    })

    it('create function saves new reminder in database', async () => {
      const creator = getExampleTwitchUserEntity({})
      const reciever = getExampleTwitchUserEntity({ id: 2, name: 'user2' })
      const reminderData: ReminderCreationData = {
        creatorId: creator.id,
        recieverName: reciever.name,
        message: 'message',
        channel: 'channel'
      }
      jest.spyOn(Date, 'now').mockImplementation(() => 1)
      await hb.db.user.save(creator)
      await hb.db.user.save(reciever)

      const result = await service.create(reminderData)
      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data: savedEntity } = result as ResourceSuccess<ReminderEntity>

      const expectedEntity: ReminderEntity = {
        id: 1,
        creator,
        reciever,
        message: reminderData.message,
        createdChannel: reminderData.channel,
        firedAt: null,
        firedChannel: null,
        status: ReminderStatus.CREATED,
        createdAt: Date.now()
      }

      expect(savedEntity.creator.id).toEqual(expectedEntity.creator.id)
      expect(savedEntity.reciever.id).toEqual(expectedEntity.reciever.id)
      expect(savedEntity.createdChannel).toEqual(expectedEntity.createdChannel)
      expect(savedEntity.message).toEqual(expectedEntity.message)
      expect(savedEntity.createdAt).toEqual(expectedEntity.createdAt)
      expect(savedEntity.firedChannel).toEqual(expectedEntity.firedChannel)
      expect(savedEntity.firedAt).toEqual(expectedEntity.firedAt)
      expect(savedEntity.status).toEqual(expectedEntity.status)
    })
  })
})
