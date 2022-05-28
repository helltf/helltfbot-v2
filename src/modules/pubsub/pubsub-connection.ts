import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import { LogType } from '../../logger/log-type.js'
import {
  TopicString,
  OutgoingMessage,
  NotifyEventType,
  ParsedPubSubData,
  Topic,
  MessageType
} from './types.js'
import * as WS from 'ws'

const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

export class PubSubConnection {
  connection: ReconnectingWebSocket
  topics: Topic[] = []
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

  listenToTopics(topics: Topic[]) {
    const message = this.getMessage(topics, 'LISTEN')

    this.sendMessage(message)

    this.topics.push(...topics)
  }

  sendMessage(message: OutgoingMessage) {
    this.connection.send(JSON.stringify(message))
  }

  getMessage(topics: Topic[], type: MessageType) {
    return {
      type: type,
      nonce: '',
      data: {
        auth_token: process.env.TWITCH_OAUTH,
        topics: topics.map(t => t.type + t.id)
      }
    }
  }

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicString {
    if (notifyType === NotifyEventType.SETTING) return TopicString.SETTING
    return TopicString.STATUS
  }

  handleIncomingMessage({ data }: { data: string }) {
    const parsedData: ParsedPubSubData = JSON.parse(data)

    if (parsedData.type === 'RECONNECT') {
      this.reconnect()
    }

    this.logError(parsedData.error)
  }

  async reconnect() {
    hb.log(
      LogType.PUBSUB,
      'A Pubsub connection has been closed and will restart'
    )

    this.connection.reconnect()

    this.listenToTopics(this.topics)

    hb.log(LogType.PUBSUB, 'Connection successfully restartet')
  }

  logError(error: any) {
    if (!error) return

    hb.log(LogType.PUBSUB, 'Error occured: ' + error)
  }

  containsTopic(topic: Topic): boolean {
    return this.topics.some(t => t.id === topic.id && t.type === topic.type)
  }

  unlisten(topic: Topic) {
    const message = this.getMessage([topic], 'UNLISTEN')

    this.sendMessage(message)

    this.removeTopic(topic)
  }

  removeTopic(topic: Topic) {
    const index = this.topics.indexOf(topic);

    if (index > -1) {
      this.topics.splice(index, 1)
    }
  }
}
