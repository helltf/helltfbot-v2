import { NotificationChannelInfo } from '../../db/entity/notification_channel.js'
import { LogType } from '../../logger/log-type.js'
import { NotificationHandler } from './notification-handler.js'
import { PubSubConnection } from './pubsub-connection.js'
import { MessageType, NotifyEventType, TopicPrefix, Topic } from './types.js'
import { UpdateEventHandler } from './update-event-handler.js'

export class PubSub {
  updateEventHandler: UpdateEventHandler
  notificationHandler: NotificationHandler
  connections: PubSubConnection[] = []

  constructor() {
    this.updateEventHandler = new UpdateEventHandler()
    this.notificationHandler = new NotificationHandler()
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

    for (const channels of chunkedChannels) {
      const connection = this.createNewPubSubConnection()

      const topics = this.getTopics(channels)

      connection.listenToTopics(topics)
    }

    hb.log(LogType.PUBSUB, 'Successfully connected to Pubsub')
  }

  createNewPubSubConnection(): PubSubConnection {
    const connection = new PubSubConnection()

    connection.connection.addEventListener('message', ({ data }) => {
      this.handlePubSubMessage(JSON.parse(data))
    })

    this.connections.push(connection)

    return connection
  }

  getTopics(channels: NotificationChannelInfo[]): Topic[] {
    return channels.reduce((acc: Topic[], { setting, status, id }) => {
      const topics: Topic[] = []

      if (setting) topics.push({ prefix: TopicPrefix.SETTING, id })
      if (status) topics.push({ prefix: TopicPrefix.STATUS, id })

      return acc.concat(topics)
    }, [])
  }

  handlePubSubMessage = (data: any) => {
    const type: MessageType = data.type

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

    return !openConnections.length ? this.createNewPubSubConnection() : openConnections[0]
  }

  listenToTopic(topic: Topic) {
    const connection = this.getOpenConnection()

    connection.listenToTopics([topic])
  }

  findConnectionForTopic(topic: Topic): PubSubConnection | undefined {
    return this.connections.find(con => con.containsTopic(topic))
  }

  mapNotifyTypeToTopicPrefix(event: NotifyEventType): TopicPrefix {
    if (event === NotifyEventType.STATUS) return TopicPrefix.STATUS
    return TopicPrefix.SETTING
  }

  unlistenStreamerTopic(id: number, event: NotifyEventType) {
    const topic: Topic = {
      id: id,
      prefix: this.mapNotifyTypeToTopicPrefix(event)
    }

    const connection = this.findConnectionForTopic(topic)

    if (!connection) return

    connection.unlisten(topic)
  }
}
