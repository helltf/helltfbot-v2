import { ChatUserstate } from 'tmi.js'
import { getUserIdByName } from '../../api/twitch/user-info.js'
import { BotResponse } from '../../client/response.js'
import {
  NotifyEventType,
  TopicType,
  UpdateEventType
} from '../../modules/pubsub/types.js'
import { Command } from '../export/types.js'

const notify = new Command({
  name: 'notify',
  description: 'notify for events',
  permissions: 5,
  requiredParams: ['streamer', 'event'],
  optionalParams: [],
  cooldown: 5000,
  execute: async (
    channel: string,
    user: ChatUserstate,
    [streamer, event]: string[]
  ): Promise<BotResponse> => {
    if (eventIsNotValid(event)) return getUnknownEventErrorResponse(channel)
    const eventType = event as UpdateEventType
    const userId = parseInt(user['user-id'])

    if (await userIsAlreadyNotified(userId, eventType)) {
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
  const id = await getUserIdByName(streamer)
  if (!id) return false

  const notifyType = mapUpdateEventTypeToTopic(event)
  await updateTopicTypeForChannel(streamer, notifyType)

  hb.pubSub.listenToTopic(id, notifyType)

  return true
}
export async function userIsAlreadyNotified(
  userId: number,
  event: UpdateEventType
): Promise<boolean> {
  return (
    (await hb.db.notificationRepo.findOne({
      where: {
        user: {
          id: userId
        },
        [event]: true
      },
      relations: {
        user: true
      }
    })) !== null
  )
}

async function updateTopicTypeForChannel(
  name: string,
  topicType: NotifyEventType
) {
  await hb.db.notificationChannelRepo.save({
    name: name,
    [topicType]: true
  })
}

export async function pubSubConnectedToStreamerEvent(
  streamer: string,
  eventType: UpdateEventType
): Promise<boolean> {
  let event = mapUpdateEventTypeToTopic(eventType)
  return (
    (await hb.db.notificationChannelRepo.findOneBy({
      name: streamer,
      [event]: true
    })) === null
  )
}

export function eventIsNotValid(event: string) {
  return !Object.values(UpdateEventType).includes(event as UpdateEventType)
}

function mapUpdateEventTypeToTopic(event: UpdateEventType): NotifyEventType {
  if (event === UpdateEventType.GAME || event === UpdateEventType.TITLE)
    return NotifyEventType.SETTING
  if (event === UpdateEventType.LIVE || event === UpdateEventType.OFFLINE)
    return NotifyEventType.STATUS
}

export async function updateNotification(
  channel: string,
  streamer: string,
  event: UpdateEventType,
  id: number
) {
  const user = await hb.db.userRepo.findOneBy({ id: id })

  if (await userHasNotification(id, streamer)) {
    await hb.db.notificationRepo.update(
      {
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
      user: user
    })
  }
}

export async function userHasNotification(
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

export enum StreamerEventType {
  SETTING = 'setting',
  STATUS = 'status'
}

export { notify }
