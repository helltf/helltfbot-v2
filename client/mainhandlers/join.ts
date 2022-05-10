import { LogType } from '../../logger/log-type.js'
import { wait } from '../../utilities/timeout.js'

const TWITCH_ERROR_MESSAGE = ['msg_channel_suspended']

const incrementConnection = async (channel: string) => {
  await hb.db.channelRepo.increment(
    {
      channel: channel
    },
    'times_connected',
    1
  )
}

const saveChannel = async (channel: string) => {
  const channelExsisting = await hb.db.channelRepo.countBy({
    channel: channel
  })

  if (channelExsisting) return

  await hb.db.channelRepo.save({
    channel: channel,
    allowed: false,
    allowed_live: true,
    connect_timestamp: Date.now(),
    times_connected: 1,
    joined: true
  })
}

export const handleJoin = async (channel: string) => {
  channel = channel.replace('#', '')
  await saveChannel(channel)
  await incrementConnection(channel)
}

const mainJoinChannel = async (channel: string) => {
  try {
    await hb.client.join(channel)
  } catch (e) {
    if (TWITCH_ERROR_MESSAGE.includes(e)) {
      hb.db.channelRepo.update(
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
  if (process.env.NODE_ENV === 'dev') {
    await hb.client.join(process.env.MAIN_USER)
    return
  }

  const joinedChannels = await hb.db.channelRepo.findBy({
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
