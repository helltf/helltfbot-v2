import { ResourceError, ResourceSuccess } from "@api/types"
import { ReminderEntity } from "@db/entities"
import { ReminderStatus, ReminderType } from "@src/db/entities/reminder.entity"
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
        channel: 'channel',
        scheduledAt: 1
      }
      jest.spyOn(Date, 'now').mockReturnValue(1)
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
        status: ReminderStatus.PENDING,
        createdAt: Date.now(),
        type: ReminderType.USER,
        scheduledAt: 1
      }

      expect(savedEntity.creator?.id).toEqual(expectedEntity.creator?.id)
      expect(savedEntity.reciever.id).toEqual(expectedEntity.reciever.id)
      expect(savedEntity.createdChannel).toEqual(expectedEntity.createdChannel)
      expect(savedEntity.message).toEqual(expectedEntity.message)
      expect(savedEntity.createdAt).toEqual(expectedEntity.createdAt)
      expect(savedEntity.firedChannel).toEqual(expectedEntity.firedChannel)
      expect(savedEntity.firedAt).toEqual(expectedEntity.firedAt)
      expect(savedEntity.status).toEqual(expectedEntity.status)
      expect(savedEntity.scheduledAt).toBe(expectedEntity.scheduledAt)
    })

    it('reminder create limit is exceeded return error', async () => {
      const creator = getExampleTwitchUserEntity({})
      const reciever = getExampleTwitchUserEntity({ id: 2, name: 'user2' })
      const reminderData: ReminderCreationData = {
        creatorId: creator.id,
        recieverName: reciever.name,
        message: 'message',
        channel: 'channel'
      }
      await hb.db.user.save([creator, reciever])
      await hb.db.reminder.save(
        Array(5)
          .fill('')
          .map((_, index) => {
            return getExampleReminderEntity({
              creator,
              reciever,
              id: index
            })
          })
      )

      const result = await service.create(reminderData)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError
      const expectedError = 'Cannot create more than 5 reminders'

      expect(error).toBe(expectedError)
    })

    it('reciever already has 5 reminders pending return error', async () => {
      {
        const creator = getExampleTwitchUserEntity({})
        const secondCreator = getExampleTwitchUserEntity({
          id: 3,
          name: 'test'
        })
        const reciever = getExampleTwitchUserEntity({ id: 2, name: 'user2' })
        const reminderData: ReminderCreationData = {
          creatorId: creator.id,
          recieverName: reciever.name,
          message: 'message',
          channel: 'channel'
        }
        await hb.db.user.save([creator, reciever, secondCreator])
        await hb.db.reminder.save(
          Array(4)
            .fill('')
            .map((_, index) => {
              return getExampleReminderEntity({
                creator,
                reciever,
                id: index
              })
            })
        )
        await hb.db.reminder.save(
          getExampleReminderEntity({
            creator: secondCreator,
            reciever,
            id: 10
          })
        )

        const result = await service.create(reminderData)

        expect(result).toBeInstanceOf(ResourceError)

        const { error } = result as ResourceError
        const expectedError = 'Reciever reached reminder limit'

        expect(error).toBe(expectedError)
      }
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
        status: ReminderStatus.PENDING,
        id: 2
      })
      await saveReminder(reminder1)
      await hb.db.reminder.save(reminder2)

      const result = await service.getActiveReminders(reminder1.reciever.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(1)
    })

    it('user has 1 system reminder return empty array', async () => {
      const reminder = getExampleReminderEntity({
        type: ReminderType.SYSTEM
      })
      await saveReminder(reminder)

      const result = await service.getActiveReminders(reminder.reciever.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(0)
    })
  })

  describe('fire', () => {
    it('reminder exists update fired fields and status', async () => {
      const reminder = getExampleReminderEntity({})
      const channel = 'channel'
      await hb.db.user.save([reminder.creator!, reminder.reciever])
      await hb.db.reminder.save(reminder)
      jest.spyOn(Date, 'now').mockReturnValue(1)

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

  describe('create system reminder', () => {
    it('reciever does not exist return error', async () => {
      const result = await service.createSystemReminder(1, 'test')

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('User does not exist')
    })

    it('reciever exists create new system reminder', async () => {
      const reciever = getExampleTwitchUserEntity({})
      const message = 'message'
      await hb.db.user.save(reciever)

      const result = await service.createSystemReminder(reciever.id, message)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity>
      const savedEntity = await hb.db.reminder.findOneBy({
        id: data.id,
        type: ReminderType.SYSTEM
      })

      expect(savedEntity).not.toBeNull()
    })
  })
  describe('get system reminders', () => {
    it('user does not exist return error', async () => {
      const result = await service.getActiveSystemReminders(1)

      expect(result).toBeInstanceOf(ResourceError)

      const { error } = result as ResourceError

      expect(error).toBe('Invalid user')
    })

    it('user has no system reminders return empty list', async () => {
      const user = getExampleTwitchUserEntity({})
      await hb.db.user.save(user)

      const result = await service.getActiveSystemReminders(user.id)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(0)
    })

    it('user has 1 reminder return array with length 1', async () => {
      const reminder = getExampleReminderEntity({
        type: ReminderType.SYSTEM
      })
      reminder.creator = null
      await hb.db.user.save(reminder.reciever)
      await hb.db.reminder.save(reminder)

      const result = await service.getActiveSystemReminders(
        reminder.reciever.id
      )

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<ReminderEntity[]>

      expect(data).toHaveLength(1)
    })
  })

  describe('get scheduled reminders', () => {
    it('user does not exist return empty array', async () => {
      const reminders = await service.getScheduledReminders()

      expect(reminders).toHaveLength(0)
    })

    it('user has one reminder scheduled return array with 1 reminder', async () => {
      const reminder = getExampleReminderEntity({
        scheduledAt: 1
      })
      await saveReminder(reminder)

      const reminders = await service.getScheduledReminders()

      expect(reminders).toHaveLength(1)
    })

    it('user has one reminder in future return empty array', async () => {
      const reminder = getExampleReminderEntity({
        scheduledAt: 1
      })
      jest.spyOn(Date, 'now').mockReturnValue(0)
      await saveReminder(reminder)

      const reminders = await service.getScheduledReminders()

      expect(reminders).toHaveLength(0)
    })
  })
})

async function saveReminder(reminder: ReminderEntity) {
  await hb.db.user.save([reminder.creator!, reminder.reciever])
  await hb.db.reminder.save(reminder)
}
