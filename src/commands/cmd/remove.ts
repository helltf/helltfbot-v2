import { ChatPermissionLevel } from "@src/utilities/permission/types"
import { UpdateResult } from "typeorm"
import { BotResponse } from "../../client/types"
import { UserNotificationType } from '../../modules/pubsub/types'
import { NotificationService } from '../../service/notification.service'
import { Command, CommandContext, CommandFlag } from '../types'

export class RemoveCommand implements Command {
  name = 'remove'
  alias = ['rmn', 'removenotify', 'removeme', 'removenotification']
  cooldown = 5000
  description = 'removes your notification for the given streamer on the event'
  optionalParams = []
  requiredParams = ['streamer', 'event']
  permissions = ChatPermissionLevel.USER
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute({
    channel,
    user: { 'user-id': unparsedUserId },
    message: [streamer, event]
  }: CommandContext): Promise<BotResponse> {
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
    async removeEventNotification(
      userId: number,
      streamer: string,
      event: UserNotificationType
    ): Promise<UpdateResult> {
      return await hb.db.notification.update(
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