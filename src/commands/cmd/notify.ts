import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BotResponse } from '../../client/types'

import {
  NotifyEventType,
  Topic,
  UserNotificationType
} from '../../modules/pubsub/types'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class NotifyCommand extends BaseCommand {
  name = 'notify'
  flags: CommandFlag[] = [CommandFlag.LOWERCASE]
  description = 'create a notification for any event'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['streamer', 'event'] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = ['notifyme', 'noti', 'notification']

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute({
    channel,
    user,
    params: { streamer, event }
  }: CommandContext<NotifyCommand>): Promise<BotResponse> {
    if (this.methods.eventIsNotValid(event))
      return this.methods.getUnknownEventErrorResponse()

    const eventType = event as UserNotificationType
    const userId = parseInt(user['user-id']!)

    if (await this.methods.userIsAlreadyNotified(userId, streamer, eventType)) {
      return {
        success: false,
        response: 'You are already registered for this notification'
      }
    }

    if (
      !(await this.methods.pubSubConnectedToStreamerEvent(streamer, eventType))
    ) {
      const success = await this.methods.createNewStreamerConnection(
        streamer,
        eventType
      )

      if (!success) {
        return {
          success: false,
          response: 'Could not establish new connection. Streamer not found!'
        }
      }
    }

    await this.methods.updateNotification(channel, streamer, eventType, userId)

    return {
      success: true,
      response: 'Successfully created your notification'
    }
  }

  methods = {
    createNewStreamerConnection: async (
      streamer: string,
      event: UserNotificationType
    ): Promise<boolean> => {
      const id = await this.deps.api.twitch.getUserIdByName(streamer)
      if (!id) return false

      const notifyType = this.methods.mapEventTypeToNotifyType(event)

      await this.methods.updateTopicTypeForChannel(streamer, id, notifyType)

      const topic: Topic = {
        id: id,
        prefix: this.deps.pubSub.mapNotifyTypeToTopicPrefix(notifyType)
      }

      this.deps.pubSub.listenToTopic(topic)

      return true
    },

    userIsAlreadyNotified: async (
      userId: number,
      streamer: string,
      event: UserNotificationType
    ): Promise<boolean> => {
      return (
        (await this.deps.db.notification.findOne({
          where: {
            user: {
              id: userId
            },
            streamer: streamer,
            [event]: true
          },
          relations: {
            user: true
          }
        })) !== null
      )
    },

    updateTopicTypeForChannel: async (
      channel: string,
      id: number,
      topicType: NotifyEventType
    ) => {
      await this.db.notificationChannel.save({
        name: channel,
        [topicType]: true,
        id: id
      })
    },

    pubSubConnectedToStreamerEvent: async (
      streamer: string,
      eventType: UserNotificationType
    ): Promise<boolean> => {
      const event = this.methods.mapEventTypeToNotifyType(eventType)
      return (
        (await this.db.notificationChannel.countBy({
          name: streamer,
          [event]: true
        })) === 1
      )
    },

    eventIsNotValid(event: string) {
      return !Object.values(UserNotificationType).includes(
        event as UserNotificationType
      )
    },

    mapEventTypeToNotifyType(event: UserNotificationType): NotifyEventType {
      if (
        event === UserNotificationType.GAME ||
        event === UserNotificationType.TITLE
      )
        return NotifyEventType.SETTING
      return NotifyEventType.STATUS
    },

    updateNotification: async (
      channel: string,
      streamer: string,
      event: UserNotificationType,
      id: number
    ) => {
      if (await this.userNotificationIsExisting(id, streamer)) {
        await this.db.notification.update(
          {
            streamer: streamer,
            user: {
              id: id
            }
          },
          {
            [event]: true
          }
        )
      } else {
        await this.db.notification.save({
          channel: channel,
          streamer: streamer,
          [event]: true,
          user: {
            id: id
          }
        })
      }
    },

    userNotificationIsExisting: async (
      userId: number,
      streamer: string
    ): Promise<boolean> => {
      return (
        (await this.db.notification.findOneBy({
          user: {
            id: userId
          },
          streamer: streamer
        })) !== null
      )
    },

    getUnknownEventErrorResponse(): BotResponse {
      return {
        response: `Event unknown. Valid events are ${Object.values(
          UserNotificationType
        ).join(' ')}`,
        success: false
      }
    }
  }
}
