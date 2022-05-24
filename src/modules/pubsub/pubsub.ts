import ReconnectingWebSocket from 'reconnecting-websocket'
import { NotificationChannelInfo } from '../../db/entity/notification_channel.js'
import { LogType } from '../../logger/log-type.js'
import { wait } from '../../utilities/timeout.js'
import { NotificationHandler } from './notification-handler.js'
import { PubSubConnection } from './pubsub-connection.js'
import {
  PubSubType,
  PubSubMessage,
  NotifyEventType,
  TopicType
} from './types.js'
import { UpdateEventHandler } from './update-event-handler.js'

export class PubSub {
  updateEventHandler: UpdateEventHandler
  notificationHandler: NotificationHandler
  connections: PubSubConnection[] = []

  constructor() {
    this.updateEventHandler = new UpdateEventHandler()
    this.notificationHandler = new NotificationHandler()
  }

  createNewPubSubConnection(): PubSubConnection {
    const connection = new PubSubConnection()

    connection.connection.addEventListener('message', ({ data }) => {
      this.handlePubSubMessage(JSON.parse(data))
    })

    this.connections.push(connection)

    return connection
  }

  async handleIncomingMessage({ data }: any) {
    if (!data?.message) return
    data.message = JSON.parse(data.message)

    if (!data.message) return
    const type = data.message.type
    const streamer = await this.getStreamerForTopic(data.topic)

    if (
      type === 'stream-up' ||
      type === 'stream-down' ||
      type === 'broadcast_settings_update'
    ) {
      const messages = await this.updateEventHandler.handleUpdate(
        data,
        streamer,
        type
      )
      this.notificationHandler.sendNotifications(messages)
    }
  }

  connect = async () => {
    const channels = await hb.db.notificationChannelRepo.find()
    const chunkedChannels = this.chunkTopicsIntoSize(channels)
    hb.log(LogType.PUBSUB, `Connecting to ${channels.length} topics ...`)

    for await (const channels of chunkedChannels) {
      const connection = this.createNewPubSubConnection()

      const topics = channels.filter()
      for await (const { id, setting, status } of channels) {
        if (setting) {
          this.listenToSettingsTopic(connection, id)
          await wait`1s`
        }
        if (status) {
          this.listenToStatusTopic(connection, id)
          await wait`5s`
        }
      }
    }
    hb.log(LogType.PUBSUB, 'Successfully connected to Pubsub')
  }

  getTopics(channels: NotificationChannelInfo[]): string[] {
    return channels.reduce((acc, { setting, status, id }) => {
      const topics = []

      if (setting) topics.push(TopicType.SETTING + id)
      if (status) topics.push(TopicType.STATUS + id)

      return acc.concat(topics)
    }, [])
  }

  listenToSettingsTopic(connection: PubSubConnection, id: number) {
    connection.listenToTopic(id, NotifyEventType.SETTING)
  }

  listenToStatusTopic(connection: PubSubConnection, id: number) {
    connection.listenToTopic(id, NotifyEventType.STATUS)
  }

  handlePubSubMessage = (data: any) => {
    const type: PubSubType = data.type

    if (type !== 'MESSAGE') return

    this.handleIncomingMessage(data)
  }

  sendMessage = (con: ReconnectingWebSocket, message: PubSubMessage) => {
    con.send(JSON.stringify(message))
  }

  chunkTopicsIntoSize = (
    arr: NotificationChannelInfo[],
    size = 25
  ): NotificationChannelInfo[][] => {
    return arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    )
  }

  async getStreamerForTopic(topic: string): Promise<string> {
    const id = this.getIdForTopic(topic)

    return (
      await hb.db.notificationChannelRepo.findOneBy({
        id: parseInt(id)
      })
    ).name
  }

  getIdForTopic(topic: string): string {
    return topic.match(/(?<=\.)\d+/gim)[0]
  }

  getOpenConnection(): PubSubConnection {
    const openConnections = this.connections.filter((c) => c.topics.length < 50)

    return !openConnections.length ? new PubSubConnection() : openConnections[0]
  }

  listenToTopic(id: number, event: NotifyEventType) {
    const connection = this.getOpenConnection()
    connection.listenToTopic(id, event)
  }
}
