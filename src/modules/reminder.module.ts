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

    const
  }

  reminderAsString(reminder: ReminderEntity): string {
    return `reminder from @${reminder.creator.name}: ${reminder.message}`
  }
}
