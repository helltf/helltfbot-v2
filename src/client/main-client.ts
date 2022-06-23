import { ChatUserstate, Client } from 'tmi.js'
import { LogType } from '../logger/log-type'
import { handleChat } from './handlers/chat'
import { handleConnect } from './handlers/connect'
import { handleJoin } from './handlers/join'
import { handlePart } from './handlers/part'

const client = createclient()

function createclient(): Client {
  return Client({
    identity: {
      password: 'oauth:' + process.env.TWITCH_OAUTH,
      username: 'xdforsenxdlol'
    },
    connection: { reconnect: true },
    logger: {
      info: msg => {
        if (process.env.DEBUG === 'true') hb.log(LogType.TWITCHBOT, msg)
      },
      error: msg => {
        hb.log(LogType.TWITCHBOT, msg)
      },
      warn: msg => {
        hb.log(LogType.TWITCHBOT, msg)
      }
    }
  })
}

client.on(
  'chat',
  async (
    channel: string,
    user: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    channel = channel.replace('#', '')

    handleChat(channel, user, message, self)
  }
)

client.on('part', (channel: string, username: string, self: boolean) => {
  if (!self) return
  channel = channel.replace('#', '')

  handlePart(channel)
})

client.on('join', (channel: string, username: string, self: boolean) => {
  if (!self) return

  handleJoin(channel)
})

client.on('connected', () => {
  handleConnect()
})
export { client }
