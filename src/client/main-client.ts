import { ChatUserstate, Client } from 'tmi.js'
import { handleChat } from './handlers/chat.js'
import { handleConnect } from './handlers/connect.js'
import { handleJoin } from './handlers/join.js'
import { handlePart } from './handlers/part.js'

const client = createclient()

function createclient(): Client {
  return Client({
    identity: {
      password: 'oauth:' + hb.config.get('TWITCH_OAUTH'),
      username: 'xdforsenxdlol'
    },
    connection: { reconnect: true },
    logger: {
      info: (msg) => {
        if (hb.config.get('DEBUG') === 'true') console.log(msg)
      },
      error: (msg) => {
        console.log(msg)
      },
      warn: (msg) => {
        console.log(msg)
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
