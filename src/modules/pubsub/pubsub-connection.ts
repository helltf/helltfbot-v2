import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import { LogType } from '../../logger/log-type'
import {
  TopicPrefix,
  OutgoingMessage,
  NotifyEventType,
  ParsedPubSubData,
  Topic,
  MessageType
} from './types'
import * as WS from 'ws'

const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

export class PubSubConnection {
  connection: ReconnectingWebSocket
  topics: Topic[] = []
  interval: NodeJS.Timer

  constructor(
    ws: ReconnectingWebSocket = new RWS.default(PUBSUB_URL, [], {
      WebSocket: WS.WebSocket
    })
  ) {
    this.connection = ws

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
        auth_token: hb.config.get('TWITCH_OAUTH')!,
        topics: topics.map((t) => t.prefix + t.id)
      }
    }
  }

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicPrefix {
    if (notifyType === NotifyEventType.SETTING) return TopicPrefix.SETTING
    return TopicPrefix.STATUS
  }

  handleIncomingMessage({ data }: { data: string }) {
    const parsedData: ParsedPubSubData = JSON.parse(data)

    if (parsedData.type === 'RECONNECT') {
      this.reconnect()
    }
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

  containsTopic(topic: Topic): boolean {
    return this.topics.some(
      (t) => t.id === topic.id && t.prefix === topic.prefix
    )
  }

  unlisten(topics: Topic[]) {
    const message = this.getMessage(topics, 'UNLISTEN')

    this.sendMessage(message)

    this.removeTopics(topics)
  }

  removeTopics(topics: Topic[]) {
    for (const topic of topics) {
      const index = this.topics.indexOf(topic)

      if (index > -1) {
        this.topics.splice(index, 1)
      }
    }
  }
}
