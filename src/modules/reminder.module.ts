import { ResourceError } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ChatUserstate } from 'tmi.js'
import { Module } from './types'

export class ReminderModule implements Module {
  name = 'reminder'
  initialize = () => {
    hb.client.addListener(
      'message',
      (channel: string, user: ChatUserstate, _: string, self) => {
        if (self) return
        const id = Number(user['user-id'])

        this.checkReminders(id, channel)
      }
    )
  }
  async checkReminders(id: number, channel: string) {
    const userReminders = await hb.reminder.getReminders(id)
    if (userReminders instanceof ResourceError || !userReminders.data.length)
      return

    const reminderMessage = this.createReminderMessage(userReminders.data)
    hb.sendMessage(channel, reminderMessage)
  }

  reminderAsString(reminder: ReminderEntity): string {
    return `reminder from @${reminder.creator.name} (${hb.utils.humanizeNow(
      reminder.createdAt
    )}): ${reminder.message}`
  }

  createReminderMessage = (reminders: ReminderEntity[]) => {
    return (
      `@${reminders[0].reciever.name} ${hb.utils.plularizeIf(
        'reminder',
        reminders.length
      )}` +
      reminders.map((r: ReminderEntity) => this.reminderAsString(r)).join('|')
    )
  }
}
