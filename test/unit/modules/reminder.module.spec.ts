import { ResourceError, ResourceSuccess } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderModule } from '@modules/reminder.module'
import { ReminderType } from '@src/db/entities/reminder.entity'
import { getExampleReminderEntity } from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('reminder module', () => {
  let module: ReminderModule

  beforeAll(async () => {
    setup()
  })

  beforeEach(async () => {
    module = new ReminderModule()
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
        .spyOn(hb.reminder, 'getActiveReminders')
        .mockResolvedValue(new ResourceError('Invalid user'))
      expect(hb.sendMessage).not.toHaveBeenCalled()
    })

    it("user has no reminders don't send message", () => {
      const reminders: ReminderEntity[] = []
      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest
        .spyOn(hb.reminder, 'getActiveReminders')
        .mockResolvedValue(new ResourceSuccess(reminders))

      expect(hb.sendMessage).not.toHaveBeenCalled()
    })

    it('user has reminder send reminder message', async () => {
      const reminder = getExampleReminderEntity({})
      const reminders = [reminder]
      const channel = 'channel'
      const reminderMessage = 'testMessage'
      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest
        .spyOn(hb.reminder, 'getActiveReminders')
        .mockResolvedValue(new ResourceSuccess(reminders))
      jest
        .spyOn(module, 'createReminderMessage')
        .mockReturnValue(reminderMessage)
      jest.spyOn(module, 'updateRemindersStatus').mockImplementation(jest.fn())

      await module.checkReminders(1, channel)

      expect(hb.sendMessage).toHaveBeenCalledWith(channel, reminderMessage)
      expect(module.updateRemindersStatus).toHaveBeenCalledWith(channel, [
        reminder.id
      ])
    })
  })

  describe('check system reminders', () => {
    it('send Reminder is invoked with active system reminders', async () => {
      const reminders = new ResourceSuccess([] as ReminderEntity[])
      const channel = 'channel'
      jest.spyOn(module, 'sendReminders').mockImplementation(jest.fn())
      jest
        .spyOn(hb.reminder, 'getActiveSystemReminders')
        .mockResolvedValue(reminders)

      await module.checkSystemReminders(1, channel)

      expect(module.sendReminders).toHaveBeenCalledWith(reminders, channel)
    })
  })

  describe('check user reminders', () => {
    it('send Reminder is invoked with active user reminders', async () => {
      const reminders = new ResourceSuccess([] as ReminderEntity[])
      const channel = 'channel'
      jest.spyOn(module, 'sendReminders').mockImplementation(jest.fn())
      jest.spyOn(hb.reminder, 'getActiveReminders').mockResolvedValue(reminders)

      await module.checkReminders(1, channel)

      expect(module.sendReminders).toHaveBeenCalledWith(reminders, channel)
    })
  })

  describe('update reminders status', () => {
    it('one reminder given update status to fired', async () => {
      const reminder = getExampleReminderEntity({})
      const channel = 'channel'
      jest.spyOn(hb.reminder, 'fire').mockImplementation(jest.fn())

      await module.updateRemindersStatus(channel, [reminder.id])

      expect(hb.reminder.fire).toHaveBeenCalledWith(reminder.id, channel)
    })

    it('two reminders given update both status to fired', async () => {
      const reminder1 = getExampleReminderEntity({})
      const reminder2 = getExampleReminderEntity({})
      const channel = 'channel'
      jest.spyOn(hb.reminder, 'fire').mockImplementation(jest.fn())

      await module.updateRemindersStatus(channel, [reminder1.id, reminder2.id])

      expect(hb.reminder.fire).toHaveBeenCalledWith(reminder1.id, channel)
      expect(hb.reminder.fire).toHaveBeenCalledWith(reminder2.id, channel)
    })
  })

  describe('stringify', () => {
    it('user reminder gets returned as info string', () => {
      const reminder = getExampleReminderEntity({})
      const expectedString = `by @${reminder.creator?.name} - ${
        reminder.message
      } (${hb.utils.humanizeNow(reminder.createdAt)} ago)`

      const reminderString = module.reminderAsString(reminder)

      expect(reminderString).toBe(expectedString)
    })

    it('system reminder gets returned as info string', () => {
      const reminder = getExampleReminderEntity({ type: ReminderType.SYSTEM })
      const expectedString = `${reminder.message} (${hb.utils.humanizeNow(
        reminder.createdAt
      )} ago)`

      const reminderString = module.reminderAsString(reminder)

      expect(reminderString).toBe(expectedString)
    })
  })

  describe('create reminder message', () => {
    it('user has 1 user reminder return message', () => {
      const reminder = getExampleReminderEntity({})
      const expectedMessage = `@${
        reminder.reciever.name
      } you recieved 1 reminder: ${module.reminderAsString(reminder)}`

      const message = module.createReminderMessage([reminder])

      expect(message).toBe(expectedMessage)
    })

    it('user has 2 user reminders return message', () => {
      const reminder1 = getExampleReminderEntity({})
      const reminder2 = getExampleReminderEntity({})
      const message = module.createReminderMessage([reminder1, reminder2])

      const expectedMessage = `@${
        reminder1.reciever.name
      } you recieved 2 reminders: ${module.reminderAsString(
        reminder1
      )} | ${module.reminderAsString(reminder2)}`

      expect(message).toBe(expectedMessage)
    })

    it('user has 1 system reminder return correct message', () => {
      const reminder = getExampleReminderEntity({ type: ReminderType.SYSTEM })
      const expectedMessage = `@${
        reminder.reciever.name
      } you recieved 1 System reminder: ${module.reminderAsString(reminder)}`

      const message = module.createReminderMessage([reminder])

      expect(message).toBe(expectedMessage)
    })
  })
})
