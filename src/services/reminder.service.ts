import { Resource, ResourceError } from '@api/types'

export interface ReminderCreationData {
creatorId: number
  recieverName: string
  message: string
  channel: string
}

export class ReminderService {
  create(data: ReminderCreationData): Resource<null> {
    return new ResourceError('')
  }
}
