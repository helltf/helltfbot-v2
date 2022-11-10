import { ResourceError, ResourceSuccess } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderModule } from '@modules/reminder.module'
import { clearDb, clearRedis } from '@test-utils/clear'
import { disconnectDatabase, disconnectRedis } from '@test-utils/disconnect'
import { setupDatabase } from '@test-utils/setup-db'

describe('reminder module', () => {
  let module: ReminderModule

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    module = new ReminderModule()
    await clearDb()
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectRedis()
    await disconnectDatabase()
  })

  describe('initialize', () => {
    it('invoke starts event listener', () => {
      jest.spyOn(hb.client, 'addListener')
      module.initialize()

      expect(hb.client.addListener).toHaveBeenCalled()
    })
  })

  describe('check reminders', () => {
    it('user does not exist do not send message', () => {
      jest.spyOn(hb, 'sendMessage')
      jest
        .spyOn(hb.reminder, 'getReminders')
        .mockResolvedValue(new ResourceError('Invalid user'))
      expect(hb.sendMessage).not.toHaveBeenCalled()
    })

    it("user has no reminders don't send message", () => {
      const reminders: ReminderEntity[] = []
      jest.spyOn(hb, 'sendMessage')
      jest
        .spyOn(hb.reminder, 'getReminders')
        .mockResolvedValue(new ResourceSuccess(reminders))

      expect(hb.sendMessage).not.toHaveBeenCalled()
    })
  })
})
