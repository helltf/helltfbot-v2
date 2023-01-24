import { DB } from "@src/db/export-repositories"
import { ChatPermissionLevel } from "@src/utilities/permission/types"
import { UpdateResult } from "typeorm"
import { BotResponse } from '../../client/types'
import { UserNotificationType } from '../../modules/pubsub/types'
import { NotificationService } from '../../services/notification.service'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class RemovemeCommand extends BaseCommand {
  name = 'removeme'
  alias = ['rmn', 'removenotify', 'removenotification']
  cooldown = 5000
  description = 'removes your notification for the given streamer on the event'
  optionalParams = [] as const
  requiredParams = ['streamer', 'event'] as const
  permissions = ChatPermissionLevel.USER
  flags: CommandFlag[] = [CommandFlag.WHISPER, CommandFlag.LOWERCASE]
  db: DB

  constructor(db: DB) {
    super()
    this.db = db
  }

  async execute({
    channel,
    user: { 'user-id': unparsedUserId },
    params: { streamer, event }
  }: CommandContext<RemovemeCommand>): Promise<BotResponse> {
    const userId = Number(unparsedUserId)
    const eventType = event as UserNotificationType

    const errorResponse = {
      success: false,
      channel,
      response: ''
    }

    if (!streamer) {
      errorResponse.response = 'No streamer specified'
      return errorResponse
    }

    if (this.methods.eventIsNotValid(eventType)) {
      errorResponse.response = `Event unknown. Valid events are ${Object.values(
        UserNotificationType
      ).join(' ')}`

      return errorResponse
    }

    const { affected } = await this.methods.removeEventNotification(
      userId,
      streamer,
      eventType
    )

    if (!affected) {
      errorResponse.response = 'No matching notification found'
      return errorResponse
    }

    await new NotificationService().cleanAllNotifications()

    return {
      success: true,
      response: 'Successfully removed your notification'
    }
  }
  methods = {
    removeEventNotification: async (
      userId: number,
      streamer: string,
      event: UserNotificationType
    ): Promise<UpdateResult> => {
      return await this.db.notification.update(
        {
          user: {
            id: userId
          },
          streamer: streamer
        },
        {
          [event]: false
        }
      )
    },

    eventIsNotValid(event: string) {
      return !Object.values(UserNotificationType).includes(
        event as UserNotificationType
      )
    }
  }
}
