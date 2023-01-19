import { ReminderJob } from "@src/jobs/reminder.job"
import { getExampleReminderEntity } from "@test-utils/example"

describe('reminder job', () => {
  let job: ReminderJob

  beforeEach(() => {
    job = new ReminderJob()
  })
  describe('on execute', () => {
    it('job gets all scheduled reminders and fires them', async () => {
      const reminders = [getExampleReminderEntity({})]
      jest.spyOn(job, 'getReminders').mockResolvedValue(reminders)
      jest.spyOn(job, 'fireReminders').mockImplementation(jest.fn())

      await job.execute()

      expect(job.getReminders).toHaveBeenCalled()
      expect(job.fireReminders).toHaveBeenCalledWith(reminders)
    })
  })
})
