import { Resource, ResourceError, ResourceSuccess } from '@api/types'
import { ReminderEntity } from '@db/entities'

export interface ReminderCreationData {
  creatorId: number
  recieverName: string
  message: string
  channel: string
}

export class ReminderService {
  async create({
    creatorId,
    recieverName,
    message,
    channel
  }: ReminderCreationData): Promise<Resource<ReminderEntity>> {
    const creator = (await hb.db.user.findOneBy({ id: creatorId }))!
    const reciever = (await hb.db.user.findOneBy({ name: recieverName }))!

    const result = await hb.db.reminder.save({
      creator,
      reciever,
      createdAt: Date.now(),
      message,
      createdChannel: channel
    })

    return new ResourceSuccess(result)
  }
}
