import { LogType } from '../../logger/log-type'
import { wait } from '../../utilities/wait'

const TWITCH_ERROR_MESSAGE = ['msg_channel_suspended']

const incrementConnection = async (channel: string) => {
  await hb.db.channel.increment(
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
    await hb.client.join(channel)
  } catch (e: any) {
    if (TWITCH_ERROR_MESSAGE.includes(e)) {
      hb.db.channel.update(
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
  const joinedChannels = await hb.db.channel.findBy({
    joined: true
  })

  for await (const { channel } of joinedChannels) {
    await mainJoinChannel(channel)
    await wait`1s`
  }

  hb.log(
    LogType.TWITCHBOT,
    `Successfully joined ${joinedChannels.length} channels`
  )
}

export { mainJoinAllChannels }
