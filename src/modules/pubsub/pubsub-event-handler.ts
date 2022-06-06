import { Notification } from '../../db/export-entities'
import { MessageGenerator } from './message-generator'
import {
  NotificationMessageInfo,
  PubSubData,
  PubSubMessageEventType,
  SettingMessage,
  UserNotificationType
} from './types'

export class PubSubEventHandler {
  messageGenerator: MessageGenerator

  constructor() {
    this.messageGenerator = new MessageGenerator()
  }

  async handleUpdate(
    data: PubSubData<any>,
    streamer: string,
    type: PubSubMessageEventType
  ): Promise<Map<string, string[]>> {
    if (type === 'stream-up') {
      return this.handleLiveEvent(streamer)
    }

    if (type === 'stream-down') {
      return this.handleOfflineEvent(streamer)
    }

    if (type === 'broadcast_settings_update') {
      return this.handleSettingUpdateEvent(data, streamer)
    }
    return new Map()
  }

  async handleSettingUpdateEvent(
    { message }: PubSubData<SettingMessage>,
    streamer: string
  ): Promise<Map<string, string[]>> {
    let titleMessages = new Map<string, string[]>()
    let gameMessages = new Map<string, string[]>()

    if (message.old_status !== message.status) {
      const notificationMessageInfo = await this.getNotificationMessageInfo(
        UserNotificationType.TITLE,
        streamer,
        message.status
      )

      titleMessages = this.messageGenerator.generateMessages(
        notificationMessageInfo
      )
    }

    if (message.old_game !== message.game) {
      const notificationMessageInfo = await this.getNotificationMessageInfo(
        UserNotificationType.GAME,
        streamer,
        message.game
      )

      gameMessages = this.messageGenerator.generateMessages(
        notificationMessageInfo
      )
    }

    return this.messageGenerator.concatMaps(titleMessages, gameMessages)
  }

  async handleLiveEvent(streamer: string): Promise<Map<string, string[]>> {
    const notificationMessageInfo = await this.getNotificationMessageInfo(
      UserNotificationType.LIVE,
      streamer
    )

    return this.messageGenerator.generateMessages(notificationMessageInfo)
  }

  async handleOfflineEvent(streamer: string): Promise<Map<string, string[]>> {
    const notificationMessageInfo = await this.getNotificationMessageInfo(
      UserNotificationType.OFFLINE,
      streamer
    )

    return this.messageGenerator.generateMessages(notificationMessageInfo)
  }

  async getNotifiedUsers(
    streamer: string,
    event: UserNotificationType
  ): Promise<Notification[]> {
    const users = hb.db.notificationRepo.find({
      where: {
        streamer: streamer,
        [event]: true
      },
      relations: {
        user: true
      }
    })
    return users
  }

  getNotificationMessage(
    type: UserNotificationType,
    streamer: string,
    value: string | undefined
  ): string {
    if (type === UserNotificationType.LIVE) return `@${streamer} has gone live`
    if (type === UserNotificationType.OFFLINE)
      return `@${streamer} has gone offline`
    if (type === UserNotificationType.GAME)
      return `@${streamer} has changed the game to ${value}`
    if (type === UserNotificationType.TITLE)
      return `@${streamer} has changed the title to ${value}`
    return ``
  }

  async getNotificationMessageInfo(
    type: UserNotificationType,
    streamer: string,
    value: string | undefined = undefined
  ): Promise<NotificationMessageInfo> {
    const notifiedUsers = await this.getNotifiedUsers(streamer, type)
    const message = this.getNotificationMessage(type, streamer, value)

    return {
      message: message,
      notifiedUsers: notifiedUsers,
      streamer: streamer,
      type: type
    }
  }
}
