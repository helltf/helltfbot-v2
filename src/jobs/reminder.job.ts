import { ReminderEntity } from '@db/entities'
import { ReminderService } from '@src/services/reminder.service'
import { Utility } from '@src/utilities/utility'
import { Job } from './job'

export class ReminderJob implements Job {
  delay = 5000
  reminder: ReminderService
  utils: Utility

  constructor(reminder: ReminderService, utils: Utility) {
    this.reminder = reminder
    this.utils = utils
  }

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
