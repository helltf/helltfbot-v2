import { logger, LogType } from '@src/logger/logger-export'
import { getDeps } from 'deps'
import { wait } from '../../utilities/wait'
import { client } from '../main-client'

const TWITCH_ERROR_MESSAGE = ['msg_channel_suspended']
const { db } = getDeps()

const incrementConnection = async (channel: string) => {
  await db.channel.increment(
    {
      channel: channel
    },
    'times_connected',
    1
  )
}

export const handleJoin = async (channel: string) => {
  channel = channel.replace('#', '')
  await incrementConnection(channel)
}

const mainJoinChannel = async (channel: string) => {
  try {
    await client.join(channel)
  } catch (e: any) {
    if (TWITCH_ERROR_MESSAGE.includes(e)) {
      db.channel.update(
        {
          channel: channel
        },
        {
          joined: false
        }
      )
    }
  }
}

const mainJoinAllChannels = async () => {
  const joinedChannels = await db.channel.findBy({
    joined: true
  })

  for await (const { channel } of joinedChannels) {
    await mainJoinChannel(channel)
    await wait`1s`
  }

  logger.log(
    LogType.TWITCHBOT,
    `Successfully joined ${joinedChannels.length} channels`
  )
}

export { mainJoinAllChannels }
