import { ReminderEntity } from '@db/entities'
import { Job } from './job'

export class ReminderJob implements Job {
  delay = 5000
  execute = async () => {
    const reminders = await hb.reminder.getScheduledReminders()
    await this.fireReminders(reminders)
  }
  fireReminders = async (reminders: ReminderEntity[]) => {
    for await (const reminder of reminders) {
      await hb.sendMessage(
        reminder.createdChannel!,
        this.getScheduledReminderMessage(reminder)
      )
      await hb.reminder.fire(reminder.id, reminder.createdChannel!)
    }
  }
  getScheduledReminderMessage = (reminder: ReminderEntity) => {
    return `@${
      reminder.reciever.name
    } scheduled reminder (${hb.utils.humanizeNow(reminder.createdAt)} ago): ${
      reminder.message
    }`
  }
}
