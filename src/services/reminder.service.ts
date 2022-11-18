import { Resource, ResourceError, ResourceSuccess } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderStatus } from '@src/db/entities/reminder.entity'
import { SystemReminderEntity } from '@src/db/entities/system-reminder.entity'

export interface ReminderCreationData {
  creatorId: number
  recieverName: string
  message: string
  channel?: string
}

export class ReminderService {
  async create({
    creatorId,
    recieverName,
    message,
    channel
  }: ReminderCreationData): Promise<Resource<ReminderEntity>> {
    const creator = await hb.db.user.findOneBy({ id: creatorId })

    if (!creator) {
      return new ResourceError('Creator does not exist')
    }

    const reciever = await hb.db.user.findOneBy({ name: recieverName })

    if (!reciever) {
      return new ResourceError('Reciever does not exist')
    }

    const result = await hb.db.reminder.save({
      creator,
      reciever,
      createdAt: Date.now(),
      message,
      createdChannel: channel ?? null
    })

    return new ResourceSuccess(result)
  }

  async createSystemReminder(
    recieverId: number,
    message: string
  ): Promise<Resource<SystemReminderEntity>> {
    const reciever = await hb.db.user.findOneBy({ id: recieverId })

    if (!reciever) return new ResourceError('User does not exist')

    const result = await hb.db.systemReminder.save({
      reciever,
      message,
      createdAt: Date.now()
    })

    return new ResourceSuccess(result)
  }

  async getActiveSystemReminders(
    id: number
  ): Promise<Resource<SystemReminderEntity[]>> {
    const user = await hb.db.user.findOneBy({ id })

    if (!user) return new ResourceError('Invalid user')

    const reminders = await hb.db.systemReminder.findBy({
      reciever: { id },
      status: ReminderStatus.CREATED
    })

    return new ResourceSuccess(reminders)
  }

  async getActiveReminders(id: number): Promise<Resource<ReminderEntity[]>> {
    const user = await hb.db.user.findOneBy({ id })

    if (!user) return new ResourceError('Invalid user')

    const reminders = await hb.db.reminder.findBy({
      reciever: { id },
      status: ReminderStatus.CREATED
    })

    return new ResourceSuccess(reminders)
  }

  async revoke(id: number): Promise<Resource<null>> {
    const reminder = await hb.db.reminder.findOneBy({ id })

    if (!reminder)
      return new ResourceError('Cannot revoke not existing reminder')

    if (reminder.status === ReminderStatus.FIRED)
      return new ResourceError('reminder fired already')

    if (reminder.status === ReminderStatus.REVOKED)
      return new ResourceError('reminder has already been revoked')

    await hb.db.reminder.update({ id }, { status: ReminderStatus.REVOKED })

    return new ResourceSuccess(null)
  }

  async fire(id: number, channel: string) {
    return await hb.db.reminder.update(
      { id },
      {
        firedChannel: channel,
        firedAt: Date.now(),
        status: ReminderStatus.FIRED
      }
    )
  }
}
