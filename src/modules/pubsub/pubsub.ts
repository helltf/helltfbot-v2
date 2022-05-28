import { NotificationChannelInfo } from '../../db/entity/notification_channel.js'
import { LogType } from '../../logger/log-type.js'
import { NotificationHandler } from './notification-handler.js'
import { PubSubConnection } from './pubsub-connection.js'
import { PubSubType, NotifyEventType, TopicType } from './types.js'
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

      const topics = this.getTopics(channels)
      connection.listenToTopics(topics)
    }
    hb.log(LogType.PUBSUB, 'Successfully connected to Pubsub')
  }

  getTopics(channels: NotificationChannelInfo[]): string[] {
    return channels.reduce((acc: string[], { setting, status, id }) => {
      const topics: string[] = []

      if (setting) topics.push(TopicType.SETTING + id)
      if (status) topics.push(TopicType.STATUS + id)

      return acc.concat(topics)
    }, [])
  }

  handlePubSubMessage = (data: any) => {
    const type: PubSubType = data.type

    if (type !== 'MESSAGE') return

    this.handleIncomingMessage(data)
  }

  chunkTopicsIntoSize = (
    arr: NotificationChannelInfo[],
    size = 25
  ): NotificationChannelInfo[][] => {
    return arr.reduce((resultArray: NotificationChannelInfo[][], item, index) => {
      const chunkIndex = Math.floor(index / size)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])
  }

  async getStreamerForTopic(topic: string): Promise<string> {
    const id = this.getIdForTopic(topic)

    return (
      await hb.db.notificationChannelRepo.findOneBy({
        id: parseInt(id)
      })
    )!.name
  }

  getIdForTopic(topic: string): string {
    return topic.match(/(?<=\.)\d+/gim)![0]
  }

  getOpenConnection(): PubSubConnection {
    const openConnections = this.connections.filter((c) => c.topics.length < 50)

    return !openConnections.length ? new PubSubConnection() : openConnections[0]
  }

  listenToTopic(id: number, event: NotifyEventType) {
    const connection = this.getOpenConnection()
    connection.listenToTopic(id, event)
  }

  findConnectionForTopic(id: number, event: NotifyEventType): PubSubConnection | undefined {
    for (const connection of this.connections) {
      const topic = this.createTopic(id, event)

      if (connection.containsTopic(topic)) {
        return connection
      }
    }
    return
  }

  createTopic(id: number, event: NotifyEventType): string {
    return `${this.mapNotifyTypeToTopicType(event)}${id}`
  }

  mapNotifyTypeToTopicType(event: NotifyEventType): TopicType {
    if (event === NotifyEventType.STATUS) return TopicType.STATUS
    return TopicType.SETTING
  }

  unlistenStreamerTopic(id: number, event: NotifyEventType) {
    const connection = this.findConnectionForTopic(id, event)

    if (!connection) return
    const topicType = this.mapNotifyTypeToTopicType(event)
    connection.unlisten(id, topicType)
  }
}
