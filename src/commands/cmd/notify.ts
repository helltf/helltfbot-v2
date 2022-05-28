import { BotResponse } from '../../client/types.js'

import { TwitchUserState } from '../../client/types.js'
import { NotifyEventType, UpdateEventType } from '../../modules/pubsub/types.js'
import { Command } from '../export/types.js'

const notify = new Command({
  name: 'notify',
  description: 'notify for events',
  permissions: 0,
  requiredParams: ['streamer', 'event'],
  optionalParams: [],
  cooldown: 5000,
  alias: [],
  execute: async (
    channel: string,
    user: TwitchUserState,
    [streamer, event]: string[]
  ): Promise<BotResponse> => {
    if (eventIsNotValid(event)) return getUnknownEventErrorResponse(channel)
    const eventType = event as UpdateEventType
    const userId = parseInt(user['user-id']!)

    if (await userIsAlreadyNotified(userId, streamer, eventType)) {
      return {
        channel: channel,
        success: false,
        response: 'You are already registered for this notification'
      }
    }

    if (!(await pubSubConnectedToStreamerEvent(streamer, eventType))) {
      const success = await createNewStreamerConnection(streamer, eventType)

      if (!success) {
        return {
          channel: channel,
          success: false,
          response: 'Could not establish new connection. Streamer not found!'
        }
      }
    }

    await updateNotification(channel, streamer, eventType, userId)

    return {
      channel: channel,
      success: true,
      response: 'Successfully created your notification'
    }
  }
})

async function createNewStreamerConnection(
  streamer: string,
  event: UpdateEventType
): Promise<boolean> {
  const id = await hb.api.twitch.getUserIdByName(streamer)
  if (!id) return false

  const notifyType = mapEventTypeToNotifyType(event)
  await updateTopicTypeForChannel(streamer, id, notifyType)

  hb.pubSub.listenToTopic(id, notifyType)

  return true
}

export async function userIsAlreadyNotified(
  userId: number,
  streamer: string,
  event: UpdateEventType
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
}

export async function updateTopicTypeForChannel(
  channel: string,
  id: number,
  topicType: NotifyEventType
) {
  await hb.db.notificationChannelRepo.save({
    name: channel,
    [topicType]: true,
    id: id
  })
}

export async function pubSubConnectedToStreamerEvent(
  streamer: string,
  eventType: UpdateEventType
): Promise<boolean> {
  const event = mapEventTypeToNotifyType(eventType)
  return (
    (await hb.db.notificationChannelRepo.countBy({
      name: streamer,
      [event]: true
    })) === 1
  )
}

export function eventIsNotValid(event: string) {
  return !Object.values(UpdateEventType).includes(event as UpdateEventType)
}

export function mapEventTypeToNotifyType(
  event: UpdateEventType
): NotifyEventType {
  if (event === UpdateEventType.GAME || event === UpdateEventType.TITLE)
    return NotifyEventType.SETTING
  return NotifyEventType.STATUS
}

export async function updateNotification(
  channel: string,
  streamer: string,
  event: UpdateEventType,
  id: number
) {
  if (await userNotificationIsExisting(id, streamer)) {
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
}

export async function userNotificationIsExisting(
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
}

function getUnknownEventErrorResponse(channel: string): BotResponse {
  return {
    response: `Event unknown. Valid events are ${Object.values(
      UpdateEventType
    ).join(' ')}`,
    channel: channel,
    success: false
  }
}

export { notify }
