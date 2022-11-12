import { Resource, ResourceError, ResourceSuccess } from '@api/types'
import { ReminderEntity } from '@db/entities'
import { ReminderStatus } from '@src/db/entities/reminder.entity'

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

  async getReminders(id: number): Promise<Resource<ReminderEntity[]>> {
    const user = await hb.db.user.findOneBy({ id })

    if (!user) return new ResourceError('Invalid user')

    const reminders = await hb.db.reminder.findBy({ reciever: { id } })

    return new ResourceSuccess(reminders)
  }

  async revoke(id: number): Promise<Resource<null>> {
    return new ResourceError('reminder fired already')
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
