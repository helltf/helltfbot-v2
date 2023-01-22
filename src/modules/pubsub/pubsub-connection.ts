import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import {
  TopicPrefix,
  OutgoingMessage,
  NotifyEventType,
  Topic,
  MessageType
} from './types'
import * as WS from 'ws'
import { logger, LogType } from '@src/logger/logger-export'
import { Utility } from '@src/utilities/utility'

const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

export class PubSubConnection {
  connection: ReconnectingWebSocket
  topics: Topic[] = []
  interval: NodeJS.Timer
  id: string
  constructor(
    ws: ReconnectingWebSocket = new RWS.default(PUBSUB_URL, [], {
      WebSocket: WS.WebSocket,
      startClosed: true
    })
  ) {
    this.connection = ws
    this.interval = this.setPingInterval()
    this.id = new Utility().randomId(10)

    if (process.env.DEBUG === 'true') {
      this.addDebugListeners()
    }
  }

  start() {
    if (!(process.env.NODE_ENV === 'test')) this.connection.reconnect()
    return this
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
        auth_token: process.env.TWITCH_OAUTH!,
        topics: topics.map(t => t.prefix + t.id)
      }
    }
  }

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicPrefix {
    if (notifyType === NotifyEventType.SETTING) return TopicPrefix.SETTING
    return TopicPrefix.STATUS
  }

  containsTopic(topic: Topic): boolean {
    return this.topics.some(t => t.id === topic.id && t.prefix === topic.prefix)
  }

  unlisten(topics: Topic[]) {
    const message = this.getMessage(topics, 'UNLISTEN')

    this.sendMessage(message)

    this.removeTopics(topics)
  }

  addDebugListeners() {
    this.connection.addEventListener('open', () => {
      logger.log(LogType.DEBUG, `${this.id}: Connection has been opened`)
    })
    this.connection.addEventListener('close', () => {
      logger.log(LogType.DEBUG, `${this.id}: Connection has been closed`)
    })
    this.connection.addEventListener('error', event => {
      logger.log(LogType.DEBUG, `${this.id}: Pubsub error occured: \n ${event}`)
    })
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
