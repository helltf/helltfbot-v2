import { ChatUserstate, Client } from 'tmi.js'
import { IdentityOptions } from '../config/config.js'
import { handleChat } from './mainhandlers/chat.js'
import { handlePart } from './mainhandlers/part.js'

const mainClient = createMainClient()

function createMainClient(): Client {
  let identity = new IdentityOptions(process.env.TWITCH_OAUTH, 'xdforsenxdlol')

  return Client({
    identity,
    connection: { reconnect: true },
    logger: {
      info: (msg) => {
        if (process.env.DEBUG === 'true') console.log(msg)
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

mainClient.on(
  'chat',
  async (
    channel: string,
    user: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    handleChat(channel, user, message, self)
  }
)

mainClient.on('part', (channel: string, username: string, self: boolean) => {
  if (!self) return
  channel = channel.replace('#', '')

  handlePart(channel, username)
})

export { mainClient }
