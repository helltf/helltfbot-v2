import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import { LogType } from '../../logger/log-type.js'
import {
  WebSocketConnection,
  TopicType,
  PubSubMessage,
  NotifyEventType,
  ParsedPubSubData
} from './types.js'
import * as WS from 'ws'

const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

export class PubSubConnection implements WebSocketConnection {
  connection: ReconnectingWebSocket
  topics: string[] = []
  interval: NodeJS.Timer

  constructor() {
    this.connection = new RWS.default(PUBSUB_URL, [], {
      WebSocket: WS.WebSocket
    })

    this.interval = this.setPingInterval()

    this.connection.addEventListener('message', (message) => {
      this.handleIncomingMessage(message)
    })
  }

  setPingInterval(): NodeJS.Timer {
    return setInterval(() => {
      this.connection.send(
        JSON.stringify({
          type: 'PING'
        })
      )
    }, 250 * 1000)
  }

  listenToTopic(id: number, type: NotifyEventType) {
    const message = this.createMessageForTopic(type, id)

    this.sendMessage(message)

    this.topics.push(...message.data.topics)
  }

  listenToTopics(topics: string[]) {
    const message = this.getListenMessageForTopic(topics)

    this.sendMessage(message)

    this.topics.push(...topics)
  }

  sendMessage(message: PubSubMessage) {
    this.connection.send(JSON.stringify(message))
  }

  createMessageForTopic = (
    notifyType: NotifyEventType,
    channelId: number
  ): PubSubMessage => {
    const type = this.mapNotifyTypeToTopic(notifyType)

    return this.getListenMessageForTopic([`${type}${channelId}`])
  }

  getListenMessageForTopic(topic: string[]): PubSubMessage {
    return {
      type: 'LISTEN',
      nonce: '',
      data: {
        auth_token: process.env.TWITCH_OAUTH,
        topics: topic
      }
    }
  }

  getUnlistenMessageForTopic(topic: string[]): PubSubMessage {
    return {
      type: 'UNLISTEN',
      nonce: '',
      data: {
        auth_token: process.env.TWITCH_OAUTH,
        topics: topic
      }
    }
  }

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicType {
    if (notifyType === NotifyEventType.SETTING) return TopicType.SETTING
    return TopicType.STATUS
  }

  handleIncomingMessage({ data }: { data: string }) {
    const parsedData: ParsedPubSubData = JSON.parse(data)

    if (parsedData.type === 'RECONNECT') {
      this.reconnect()
    }

    this.logError(parsedData.error)
  }

  async reconnect() {
    this.connection.reconnect()
    hb.log(
      LogType.PUBSUB,
      'A Pubsub connection has been closed and will restart'
    )

    this.listenToTopics(this.topics)

    hb.log(LogType.PUBSUB, 'Connection successfully restartet')
  }

  logError(error: any) {
    if (!error) return

    hb.log(LogType.PUBSUB, 'Error occured: ' + error)
  }

  containsTopic(topic: string): boolean {
    return this.topics.some(t => t === topic)
  }

  unlisten(id: number, event: TopicType) {
    const topic = event + id

    const message = this.getUnlistenMessageForTopic([topic])

    this.sendMessage(message)

    this.removeTopic(topic)
  }

  removeTopic(topic: string) {
    const index = this.topics.indexOf(topic);

    if (index > -1) {
      this.topics.splice(index, 1)
    }
  }
}
