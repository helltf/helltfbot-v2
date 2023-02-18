import { Resource, ResourceError } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderType } from '@src/db/entities/reminder.entity'
import { CommandDependencies } from 'deps'
import { ChatUserstate } from 'tmi.js'
import { Module } from './types'

export class ReminderModule implements Module {
  name = 'reminder'
  deps: CommandDependencies

  constructor(deps: CommandDependencies) {
    this.deps = deps
  }

  initialize = () => {
    this.deps.client.addListener(
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
    const userReminders = await this.reminderService.getActiveReminders(id)

    await this.sendReminders(userReminders, channel)
  }

  async checkSystemReminders(id: number, channel: string) {
    const reminders = await this.deps.reminderService.getActiveSystemReminders(
      id
    )

    await this.sendReminders(reminders, channel)
  }

  async sendReminders(reminders: Resource<ReminderEntity[]>, channel: string) {
    if (reminders instanceof ResourceError || !reminders.data.length) return

    const reminderMessage = this.createReminderMessage(reminders.data)

    await this.deps.client.say(channel, reminderMessage)
    await this.updateRemindersStatus(
      channel,
      reminders.data.map(r => r.id)
    )
  }

  async updateRemindersStatus(channel: string, reminderIds: number[]) {
    for await (const id of reminderIds) {
      await this.deps.reminderService.fire(id, channel)
    }
  }

  reminderAsString(reminder: ReminderEntity): string {
    if (reminder.type === ReminderType.USER)
      return `by @${reminder.creator?.name} - ${
        reminder.message
      } (${this.utils.humanizeNow(reminder.createdAt)} ago)`

    return `${reminder.message} (${this.deps.utils.humanizeNow(
      reminder.createdAt
    )} ago)`
  }

  createReminderMessage = (reminders: ReminderEntity[]) => {
    return (
      `@${reminders[0].reciever.name} you recieved ${reminders.length} ${
        reminders[0].type === ReminderType.SYSTEM ? 'System ' : ''
      }${this.deps.utils.plularizeIf('reminder', reminders.length)}: ` +
      reminders.map((r: ReminderEntity) => this.reminderAsString(r)).join(' | ')
    )
  }
}
