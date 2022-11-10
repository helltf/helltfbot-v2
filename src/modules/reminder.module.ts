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

    await hb.sendMessage(channel, reminderMessage)
    await this.updateRemindersStatus(
      channel,
      userReminders.data.map((r: ReminderEntity) => r.id)
    )
  }

  async updateRemindersStatus(channel: string, reminderIds: number[]) {
    for await (const id of reminderIds) {
      await hb.reminder.setFired(id, channel)
    }
  }

  reminderAsString(reminder: ReminderEntity): string {
    return `by @${reminder.creator.name}-${
      reminder.message
    } (${hb.utils.humanizeNow(reminder.createdAt)} ago)`
  }

  createReminderMessage = (reminders: ReminderEntity[]) => {
    return (
      `@${reminders[0].reciever.name} you recieved ${
        reminders.length
      } ${hb.utils.plularizeIf('reminder', reminders.length)}: ` +
      reminders.map((r: ReminderEntity) => this.reminderAsString(r)).join(' | ')
    )
  }
}
