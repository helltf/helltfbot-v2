import { hb } from "../../helltfbot.js"
import { LogType } from "../../logger/log-type.js"
import { wait } from "../../utilities/timeout.js"

const TWITCH_ERROR_MESSAGE = ['msg_channel_suspended']

const mainJoinChannel = async (channel: string) => {
	try {
		await hb.client.join(channel)
	} catch (e) {
		if (TWITCH_ERROR_MESSAGE.includes(e)) {
			hb.db.channelRepo.update(
				{
					channel: channel,
				},
				{
					joined: false,
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

	let joinedChannels = await hb.db.channelRepo.findBy({
		joined: true,
	})

	for await (let { channel } of joinedChannels) {
		await mainJoinChannel(channel)
		await wait`1s`
	}

	hb.log(LogType.TWITCHBOT, `Successfully joined ${joinedChannels.length} channels`)
}

export{mainJoinAllChannels}