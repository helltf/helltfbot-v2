import { NotificationHandler } from './notification-handler'
import { PubSubConnection } from './pubsub-connection'
import { MessageType, NotifyEventType, TopicPrefix, Topic } from './types'
import { PubSubEventHandler } from './pubsub-event-handler'
import { NotificationChannelEntity } from '@db/entities'
import { logger, LogType } from '@src/logger/logger-export'
import { Module } from '@modules/types'
import { DB } from '@src/db/export-repositories'
import { Client } from 'tmi.js'

export class PubSub implements Module {
  name = 'pubsub'
  pubSubEventHandler: PubSubEventHandler
  notificationHandler: NotificationHandler
  connections: PubSubConnection[] = []
  db: DB

  initialize = async (db: DB, client: Client) => {
    this.db = db
    this.pubSubEventHandler = new PubSubEventHandler(db)
    this.notificationHandler = new NotificationHandler(client)
    await this.connect()
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
      const messages = await this.pubSubEventHandler.handleUpdate(
        data,
        streamer,
        type
      )
      this.notificationHandler.sendNotifications(messages)
    }
  }

  connect = async () => {
    const channels = await this.db.notificationChannel.find()
    const chunkedChannels = this.chunkTopicsIntoSize(channels)
    logger.log(
      LogType.PUBSUB,
      `Starting ${chunkedChannels.length} connections and connect to ${channels.length} topics ...`
    )

    for (const channels of chunkedChannels) {
      const connection = this.createNewPubSubConnection().start()

      const topics = this.getTopics(channels)

      connection.listenToTopics(topics)
    }

    logger.log(LogType.PUBSUB, 'Successfully connected to Pubsub')
  }

  createNewPubSubConnection(): PubSubConnection {
    const connection = new PubSubConnection()

    connection.connection.addEventListener('message', ({ data }) => {
      this.handlePubSubMessage(JSON.parse(data))
    })

    this.connections.push(connection)

    return connection
  }

  getTopics(channels: NotificationChannelEntity[]): Topic[] {
    return channels.reduce((topics: Topic[], { setting, status, id }) => {
      if (setting)
        topics.push({
          prefix: TopicPrefix.SETTING,
          id
        })
      if (status)
        topics.push({
          prefix: TopicPrefix.STATUS,
          id
        })

      return topics
    }, [])
  }

  handlePubSubMessage = (data: any) => {
    const type: MessageType = data.type

    if (type !== 'MESSAGE') return

    this.handleIncomingMessage(data)
  }

  chunkTopicsIntoSize = (
    arr: NotificationChannelEntity[],
    size = 50
  ): NotificationChannelEntity[][] => {
    return arr.reduce(
      (resultArray: NotificationChannelEntity[][], item, index) => {
        const chunkIndex = Math.floor(index / size)

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }

        resultArray[chunkIndex].push(item)

        return resultArray
      },
      []
    )
  }

  async getStreamerForTopic(topic: string): Promise<string> {
    const id = this.getIdForTopic(topic)

    return (await this.db.notificationChannel.findOneBy({
      id: parseInt(id)
    }))!.name
  }

  getIdForTopic(topic: string): string {
    return topic.match(/(?<=\.)\d+/gim)![0]
  }

  getOpenConnection(): PubSubConnection {
    const openConnection = this.connections.find(c => c.topics.length < 50)

    return openConnection
      ? openConnection
      : this.createNewPubSubConnection().start()
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

    connection.unlisten([topic])
  }
}
