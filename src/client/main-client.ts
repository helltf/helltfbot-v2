import { LogType } from '@src/logger/logger-export'
import { ChatUserstate, Client } from 'tmi.js'
import { handleChat, handleWhisper } from './handlers/chat'
import { handleConnect } from './handlers/connect'
import { handleJoin } from './handlers/join'
import { handlePart } from './handlers/part'
import { logger } from '@src/logger/logger-export'

const client = createClient()

function createClient(): Client {
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
        if (hb.debug) logger.log(LogType.DEBUG, msg)
      },
      error: msg => {
        logger.log(LogType.TWITCHBOT, msg)
      },
      warn: msg => {
        logger.log(LogType.TWITCHBOT, msg)
      }
    }
  })
}

client.client.on(
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

client.client.on('part', (channel: string, _: string, self: boolean) => {
  if (!self) return
  channel = channel.replace('#', '')

  handlePart(channel)
})

client.client.on('join', (channel: string, _: string, self: boolean) => {
  if (!self) return

  handleJoin(channel)
})

client.client.on('connected', () => {
  handleConnect()
})

client.client.on('whisper', (from, user, message, self) => {
  from = from.replace('#', '')

  handleWhisper(from, user, message, self)
})

client.client.on('disconnected', r => {
  console.log(`Bot has been disconnected because: ${r}`)
})

export { client }
