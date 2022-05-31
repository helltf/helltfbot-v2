import { BotResponse } from '../../client/types.js'

import { TwitchUserState } from '../../client/types.js'
import {
  NotifyEventType,
  Topic,
  UserNotificationType
} from '../../modules/pubsub/types.js'
import { Command } from '../export/types.js'

export class NotifyCommand implements Command {
  name = 'notify'
  description = 'notify for events'
  permissions = 0
  requiredParams = ['streamer', 'event']
  optionalParams = []
  cooldown = 5000
  alias = []
  async execute(
    channel: string,
    user: TwitchUserState,
    [streamer, event]: string[]
  ): Promise<BotResponse> {
    if (this.methods.eventIsNotValid(event))
      return this.methods.getUnknownEventErrorResponse(channel)
    const eventType = event as UserNotificationType
    const userId = parseInt(user['user-id']!)

    if (await this.methods.userIsAlreadyNotified(userId, streamer, eventType)) {
      return {
        channel: channel,
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
          channel: channel,
          success: false,
          response: 'Could not establish new connection. Streamer not found!'
        }
      }
    }

    await this.methods.updateNotification(channel, streamer, eventType, userId)

    return {
      channel: channel,
      success: true,
      response: 'Successfully created your notification'
    }
  }

  methods = {
    async createNewStreamerConnection(
      streamer: string,
      event: UserNotificationType
    ): Promise<boolean> {
      const id = await hb.api.twitch.getUserIdByName(streamer)
      if (!id) return false

      const notifyType = this.mapEventTypeToNotifyType(event)

      await this.updateTopicTypeForChannel(streamer, id, notifyType)

      const topic: Topic = {
        id: id,
        prefix: hb.pubSub.mapNotifyTypeToTopicPrefix(notifyType)
      }

      hb.pubSub.listenToTopic(topic)

      return true
    },

    async userIsAlreadyNotified(
      userId: number,
      streamer: string,
      event: UserNotificationType
    ): Promise<boolean> {
      return (
        (await hb.db.notificationRepo.findOne({
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

    async updateTopicTypeForChannel(
      channel: string,
      id: number,
      topicType: NotifyEventType
    ) {
      await hb.db.notificationChannelRepo.save({
        name: channel,
        [topicType]: true,
        id: id
      })
    },

    async pubSubConnectedToStreamerEvent(
      streamer: string,
      eventType: UserNotificationType
    ): Promise<boolean> {
      const event = this.mapEventTypeToNotifyType(eventType)
      return (
        (await hb.db.notificationChannelRepo.countBy({
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

    async updateNotification(
      channel: string,
      streamer: string,
      event: UserNotificationType,
      id: number
    ) {
      if (await this.userNotificationIsExisting(id, streamer)) {
        await hb.db.notificationRepo.update(
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
        await hb.db.notificationRepo.save({
          channel: channel,
          streamer: streamer,
          [event]: true,
          user: {
            id: id
          }
        })
      }
    },

    async userNotificationIsExisting(
      userId: number,
      streamer: string
    ): Promise<boolean> {
      return (
        (await hb.db.notificationRepo.findOneBy({
          user: {
            id: userId
          },
          streamer: streamer
        })) !== null
      )
    },

    getUnknownEventErrorResponse(channel: string): BotResponse {
      return {
        response: `Event unknown. Valid events are ${Object.values(
          UserNotificationType
        ).join(' ')}`,
        channel: channel,
        success: false
      }
    }
  }
}
