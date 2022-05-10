import { ChatUserstate } from 'tmi.js'
import { getUserIdByName } from '../../api/twitch/user-info.js'
import { BotResponse } from '../../client/response.js'
import { PubSubConnection } from '../../modules/pubsub/pubsub-connection.js'
import { TopicType, UpdateEventType } from '../../modules/pubsub/types.js'
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

    if (await streamerNotExisting(streamer)) {
      const success = await createNewStreamerConnection(streamer, eventType)

      if (!success) {
        return {
          channel: channel,
          success: false,
          response: 'Could not establish new connection. Streamer not found!'
        }
      }
    }

    await updateNotification(channel, streamer, eventType, user['user-id'])

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

  await hb.db.notificationChannelRepo.save({
    name: streamer,
    id: parseInt(id)
  })

  startPubSubConnection(parseInt(id), event)

  return true
}

function mapUpdateEventTypeToTopic(event: UpdateEventType): TopicType {
  if (event === UpdateEventType.GAME || event === UpdateEventType.TITLE)
    return TopicType.SETTING
  if (event === UpdateEventType.LIVE || event === UpdateEventType.OFFLINE)
    return TopicType.STATUS
}

function startPubSubConnection(id: number, event: UpdateEventType) {
  const connection = getConnection()
  const topicType = mapUpdateEventTypeToTopic(event)

  connection.listenToTopic(id, topicType)
}

function getConnection(): PubSubConnection {
  const openConnections = hb.pubSub.connections.filter(
    (c) => c.topics.length < 50
  )
  return openConnections.length === 0
    ? new PubSubConnection()
    : openConnections[0]
}

export async function streamerNotExisting(streamer: string): Promise<boolean> {
  return (
    (await hb.db.notificationChannelRepo.findOneBy({ name: streamer })) === null
  )
}

export function eventIsNotValid(event: string) {
  return !Object.values(UpdateEventType).includes(event as UpdateEventType)
}

export async function updateNotification(
  channel: string,
  streamer: string,
  event: UpdateEventType,
  id: string
) {
  const parsedId = parseInt(id)
  const user = await hb.db.userRepo.findOneBy({ id: parsedId })

  if (await userHasNotification(parsedId, streamer)) {
    await hb.db.notificationRepo.update(
      {
        user: {
          id: parsedId
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

export { notify }
