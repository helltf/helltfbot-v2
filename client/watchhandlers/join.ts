import { hb } from '../../helltfbot.js'
import { LogType } from '../../logger/log-type.js'
import { wait } from '../../utilities/timeout.js'
import { watchClient } from '../track-bot.js'

async function watchJoinAllChannels() {
	if (process.env.NODE_ENV === 'dev') {
		watchClient.join(process.env.MAIN_USER)
		return
	}

	let channels = await hb.db.watchRepo.find()

	for await (let { channel } of channels) {
		await watchClient.join(channel)
		await wait`1s`
	}

	hb.log(LogType.TWITCHBOT, `Successfully joined ${channels.length} channels to watch`)
}

export { watchJoinAllChannels }
