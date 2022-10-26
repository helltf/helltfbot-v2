import { LogType } from '@src/logger/logger-export'
import { ChatUserstate, Client } from 'tmi.js'
import { handleChat, handleWhisper } from './handlers/chat'
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
    connection: {
      reconnect: true,
      secure: true
    },
    logger: {
      info: msg => {
        if (hb.debug) hb.log(LogType.DEBUG, msg)
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

client.on('whisper', (from, user, message, self) => {
  from = from.replace('#', '')

  handleWhisper(from, user, message, self)
})

client.on('disconnected', r => {
  console.log(`Bot has been disconnected because: ${r}`)
})

export { client }
