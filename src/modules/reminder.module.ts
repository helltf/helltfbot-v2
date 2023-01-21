import { Resource, ResourceError } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderType } from '@src/db/entities/reminder.entity'
import { DB } from '@src/db/export-repositories'
import { ReminderService } from '@src/services/reminder.service'
import { Utility } from '@src/utilities/utility'
import { ChatUserstate, Client } from 'tmi.js'
import { Module } from './types'

export class ReminderModule implements Module {
  name = 'reminder'
  db: DB
  client: Client
  reminderService: ReminderService
  utils: Utility

  constructor(
    db: DB,
    client: Client,
    reminderService: ReminderService,
    utils: Utility
  ) {
    this.db = db
    this.client = client
    this.reminderService = reminderService
    this.utils = utils
  }

  initialize = () => {
    this.client.addListener(
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
    const reminders = await this.reminderService.getActiveSystemReminders(id)

    await this.sendReminders(reminders, channel)
  }

  async sendReminders(reminders: Resource<ReminderEntity[]>, channel: string) {
    if (reminders instanceof ResourceError || !reminders.data.length) return

    const reminderMessage = this.createReminderMessage(reminders.data)

    await this.client.sendMessage(channel, reminderMessage)
    await this.updateRemindersStatus(
      channel,
      reminders.data.map(r => r.id)
    )
  }

  async updateRemindersStatus(channel: string, reminderIds: number[]) {
    for await (const id of reminderIds) {
      await this.reminderService.fire(id, channel)
    }
  }

  reminderAsString(reminder: ReminderEntity): string {
    if (reminder.type === ReminderType.USER)
      return `by @${reminder.creator?.name} - ${
        reminder.message
      } (${this.utils.humanizeNow(reminder.createdAt)} ago)`

    return `${reminder.message} (${this.utils.humanizeNow(
      reminder.createdAt
    )} ago)`
  }

  createReminderMessage = (reminders: ReminderEntity[]) => {
    return (
      `@${reminders[0].reciever.name} you recieved ${reminders.length} ${
        reminders[0].type === ReminderType.SYSTEM ? 'System ' : ''
      }${this.utils.plularizeIf('reminder', reminders.length)}: ` +
      reminders.map((r: ReminderEntity) => this.reminderAsString(r)).join(' | ')
    )
  }
}
