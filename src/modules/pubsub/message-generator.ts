import { NotificationMessageInfo } from './types'
import { Notification } from '../../db/export-entities'
export class MessageGenerator {
  maxMessageLength = 450

  generateMessages({
    message,
    notifiedUsers
  }: NotificationMessageInfo): Map<string, string[]> {
    const channelUsersMap = this.getChannelUsersMap(notifiedUsers)

    return this.getMessageMap(channelUsersMap, message)
  }

  getMessageMap(
    map: Map<string, string[]>,
    message: string
  ): Map<string, string[]> {
    const result = new Map()

    for (const [channel, users] of map) {
      result.set(channel, this.getMessageWithUsers(users, message))
    }

    return result
  }

  getMessageWithUsers(users: string[], message: string): string[] {
    return users.reduce(
      (messageArray: string[], user) =>
        this.concatUserWithMessages(messageArray, user, message),
      []
    )
  }
  concatUserWithMessages(
    messageArray: string[],
    user: string,
    message: string
  ) {
    let index = messageArray.length - 1

    let currentMessage = messageArray[index] || message

    if (this.isUserFitting(currentMessage, user)) {
      currentMessage += ` ${user}`
    } else {
      currentMessage = message + user
      index += 1
    }

    messageArray[index === -1 ? 0 : index] = currentMessage

    return messageArray
  }

  isUserFitting(message: string, user: string): boolean {
    return (message + user).length < this.maxMessageLength
  }

  getChannelUsersMap(users: Notification[]): Map<string, string[]> {
    const result = new Map()

    for (const {
      channel,
      user: { name }
    } of users) {
      this.addNewEntryToMap(result, [name], channel)
    }

    return result
  }

  addNewEntryToMap(
    map: Map<string, string[]>,
    newEntry: string[],
    key: string
  ): Map<string, string[]> {
    const entry = map.get(key)

    if (entry) {
      entry.push(...newEntry)
    } else {
      map.set(key, newEntry)
    }

    return map
  }

  concatMaps(
    map1: Map<string, string[]>,
    map2: Map<string, string[]>
  ): Map<string, string[]> {
    for (const [channel, messages] of map2) {
      this.addNewEntryToMap(map1, messages, channel)
    }

    return map1
  }
}
