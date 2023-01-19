import { ReminderEntity } from "@db/entities"
import { ReminderStatus } from "@src/db/entities/reminder.entity"
import { ReminderJob } from "@src/jobs/reminder.job"
import { getExampleReminderEntity } from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('reminder job', () => {
  let job: ReminderJob

  beforeEach(() => {
    setup()
    job = new ReminderJob()
  })

  describe('on execute', () => {
    it('job gets all scheduled reminders and fires them', async () => {
      const reminders = [getExampleReminderEntity({})]
      jest
        .spyOn(hb.reminder, 'getScheduledReminders')
        .mockResolvedValue(reminders)
      jest.spyOn(job, 'fireReminders').mockImplementation(jest.fn())

      await job.execute()

      expect(job.fireReminders).toHaveBeenCalledWith(reminders)
    })
  })

  describe('fire reminders', () => {
    it('no reminder given send no message', async () => {
      const reminders: ReminderEntity[] = []
      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

      job.fireReminders(reminders)

      expect(hb.sendMessage).not.toHaveBeenCalled()
    })

    it('one reminder open send message for that reminder', async () => {
      const reminder = getExampleReminderEntity({})
      const reminders = [reminder]
      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest.spyOn(hb.reminder, 'fire').mockImplementation(jest.fn())

      const expectedMessage = `@${
        reminder.reciever.name
      } scheduled reminder (${hb.utils.humanizeNow(reminder.createdAt)} ago): ${
        reminder.message
      }`

      await job.fireReminders(reminders)

      expect(hb.sendMessage).toHaveBeenCalledWith(
        reminder.createdChannel,
        expectedMessage
      )
      expect(hb.reminder.fire).toHaveBeenCalledWith(
        reminder.id,
        reminder.createdChannel
      )
    })

    it('two reminder open send message for both reminders', async () => {
      const reminder = getExampleReminderEntity({})
      const reminder2 = getExampleReminderEntity({ id: 2 })
      const reminders = [reminder, reminder2]
      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest.spyOn(hb.reminder, 'fire').mockImplementation(jest.fn())

      await job.fireReminders(reminders)

      expect(hb.sendMessage).toHaveBeenCalledTimes(2)
    })
  })
})
