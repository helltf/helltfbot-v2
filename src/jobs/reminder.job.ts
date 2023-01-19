import { ReminderEntity } from '@db/entities'
import { Job } from './job'

export class ReminderJob implements Job {
  delay = 5000
  execute = async () => {
    const reminders = await this.getReminders()
    await this.fireReminders(reminders)
  }
  getReminders = async (): Promise<ReminderEntity[]> => {
    return hb.reminder.getScheduledReminders()
  }
  fireReminders = async (reminders: ReminderEntity[]) => {
    hb.reminder.fireScheduledReminders()
  }
}
