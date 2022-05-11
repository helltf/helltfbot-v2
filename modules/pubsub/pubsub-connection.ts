import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import { LogType } from '../../logger/log-type.js'
import {
  WebSocketConnection,
  TopicType,
  PubSubMessage,
  NotifyEventType
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

  listenToTopic(id: number, type: NotifyEventType): NotifyEventType {
    if (this.topics.length === 50) {
      return type
    }

    const message = this.createMessageForTopic(type, id)

    this.sendMessage(message)

    this.topics.push(type + id)
  }

  sendMessage(message: PubSubMessage) {
    this.connection.send(JSON.stringify(message))
  }

  createMessageForTopic = (
    notifyType: NotifyEventType,
    channelId: number
  ): PubSubMessage => {
    const type = this.mapNotifyTypeToTopic(notifyType)
    return {
      type: 'LISTEN',
      nonce: '',
      data: {
        auth_token: process.env.TWITCH_OAUTH,
        topics: [`${type}${channelId}`]
      }
    }
  }

  mapNotifyTypeToTopic(notifyType: NotifyEventType): TopicType {
    if (notifyType === NotifyEventType.SETTING) return TopicType.SETTING
    if (notifyType === NotifyEventType.STATUS) return TopicType.STATUS
  }

  handleIncomingMessage({ data }: any) {
    const parsedData = JSON.parse(data)
    if (parsedData.type !== 'RESPONSE' && parsedData.type !== 'MESSAGE') {
      console.log('Other event' + parsedData.type)
    }

    this.logError(parsedData.error)
  }

  logError(error: any) {
    if (!error) return

    hb.log(LogType.PUBSUB, 'Error occured: ' + error)
  }
}
