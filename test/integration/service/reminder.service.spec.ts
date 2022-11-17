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
        createdChannel: reminderData.channel ?? null,
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

  describe('get active reminders', () => {
    it('user does not exist return error', async () => {
      const result = await service.getActiveReminders(1)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('Invalid user')
    })

    it('user has 0 reminders return empty array', async () => {
      const user = getExampleTwitchUserEntity({})
      await hb.db.user.save(user)

      const result = await service.getActiveReminders(user.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(0)
    })

    it('user has 1 reminder return empty array', async () => {
      const user = getExampleTwitchUserEntity({})
      const reminder = getExampleReminderEntity({ reciever: user })
      await hb.db.user.save(user)
      await hb.db.reminder.save(reminder)

      const result = await service.getActiveReminders(user.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>
      expect(data).toHaveLength(1)
    })

    it('user has 1 active and 1 revoked reminder return 1 reminder', async () => {
      const reminder1 = getExampleReminderEntity({
        status: ReminderStatus.REVOKED,
        id: 1
      })
      const reminder2 = getExampleReminderEntity({
        status: ReminderStatus.CREATED,
        id: 2
      })
      await saveReminder(reminder1)
      await hb.db.reminder.save(reminder2)

      const result = await service.getActiveReminders(reminder1.reciever.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(1)
    })
  })

  describe('fire', () => {
    it('reminder exists update fired fields and status', async () => {
      const reminder = getExampleReminderEntity({})
      const channel = 'channel'
      await hb.db.user.save([reminder.creator, reminder.reciever])
      await hb.db.reminder.save(reminder)
      jest.spyOn(Date, 'now').mockImplementation(() => 1)

      await service.fire(reminder.id, channel)

      const updatedReminder = (await hb.db.reminder.findOneBy({
        id: reminder.id
      }))!

      expect(Number(updatedReminder.firedAt)).toBe(1)
      expect(updatedReminder.status).toBe(ReminderStatus.FIRED)
      expect(updatedReminder.firedChannel).toBe(channel)
    })
  })

  describe('revoke reminder', () => {
    it('reminder has already been fired return error', async () => {
      const reminder = getExampleReminderEntity({
        status: ReminderStatus.FIRED
      })
      await saveReminder(reminder)
      const result = await service.revoke(reminder.id)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('reminder fired already')
    })

    it('reminder has already been revoked return error', async () => {
      const reminder = getExampleReminderEntity({
        status: ReminderStatus.REVOKED
      })
      await saveReminder(reminder)
      const result = await service.revoke(reminder.id)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('reminder has already been revoked')
    })

    it('reminder does not exist return error', async () => {
      const result = await service.revoke(1)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('Cannot revoke not existing reminder')
    })

    it('reminder is active revoke it', async () => {
      const reminder = getExampleReminderEntity({})
      await saveReminder(reminder)

      const result = await service.revoke(reminder.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const updatedEntity = await hb.db.reminder.findOneBy({ id: reminder.id })

      expect(updatedEntity?.status).toBe(ReminderStatus.REVOKED)
    })
  })
})

async function saveReminder(reminder: ReminderEntity) {
  await hb.db.user.save([reminder.creator, reminder.reciever])
  await hb.db.reminder.save(reminder)
}
