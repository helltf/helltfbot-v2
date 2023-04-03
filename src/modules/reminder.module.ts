import { Resource, ResourceError } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderType } from '@src/db/entities/reminder.entity'
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
        this.checkSystemReminders(id, channel)
      }
    )
  }

  async checkReminders(id: number, channel: string) {
    const userReminders = await hb.reminder.getActiveReminders(id)

    await this.sendReminders(userReminders, channel)
  }

  async checkSystemReminders(id: number, channel: string) {
    const reminders = await hb.reminder.getActiveSystemReminders(id)

    await this.sendReminders(reminders, channel)
  }

  async sendReminders(reminders: Resource<ReminderEntity[]>, channel: string) {
    if (reminders instanceof ResourceError || !reminders.data.length) return

    const reminderMessage = this.createReminderMessage(reminders.data)

    await hb.sendMessage(channel, reminderMessage)
    await this.updateRemindersStatus(
      channel,
      reminders.data.map(r => r.id)
    )
  }

  async updateRemindersStatus(channel: string, reminderIds: number[]) {
    for await (const id of reminderIds) {
      await hb.reminder.fire(id, channel)
    }
  }

  reminderAsString(reminder: ReminderEntity): string {
    if (reminder.type === ReminderType.USER)
      return `by @${reminder.creator?.name} - ${
        reminder.message
      } (${hb.utils.humanizeNow(reminder.createdAt)} ago)`

    return `${reminder.message} (${hb.utils.humanizeNow(
      reminder.createdAt
    )} ago)`
  }

  createReminderMessage = (reminders: ReminderEntity[]) => {
    return (
      `@${reminders[0].reciever.name} you recieved ${reminders.length} ${
        reminders[0].type === ReminderType.SYSTEM ? 'System ' : ''
      }${hb.language.pluralizeIf('reminder', reminders.length)}: ` +
      reminders.map((r: ReminderEntity) => this.reminderAsString(r)).join(' | ')
    )
  }
}
