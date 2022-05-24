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
import { wait } from '../../utilities/timeout.js'

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

  listenToTopic(id: number, type: NotifyEventType): NotifyEventType {
    if (this.topics.length === 50) {
      return type
    }

    const message = this.createMessageForTopic(type, id)

    this.sendMessage(message)

    this.topics.push(...message.data.topics)
  }

  listenToTopics(topics: string[]) {
    const message = this.getListenMessageForTopic(topics)

    this.sendMessage(message)
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

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicType {
    if (notifyType === NotifyEventType.SETTING) return TopicType.SETTING
    if (notifyType === NotifyEventType.STATUS) return TopicType.STATUS
  }

  handleIncomingMessage({ data }: { data: string }) {
    const parsedData: ParsedPubSubData = JSON.parse(data)

    if (parsedData.type !== 'RECONNECT') {
      this.reconnect()
    }

    this.logError(parsedData.error)
  }

  async reconnect() {
    this.connection.reconnect()
    hb.log(
      LogType.PUBSUB,
      'A Pubsub connection has been closes and will restart'
    )
    for await (const topic of this.topics) {
      const message = this.getListenMessageForTopic([topic])
      this.sendMessage(message)
      wait`5s`
    }

    hb.log(LogType.PUBSUB, 'Connection successfully restartet')
  }

  logError(error: any) {
    if (!error) return

    hb.log(LogType.PUBSUB, 'Error occured: ' + error)
  }
}
