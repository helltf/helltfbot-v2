import { hb } from '../helltfbot.js'

hb.watchclient.on(
	'timeout',
	(channel: string, username: string, _, duration: number) => {
		channel = channel.replace('#', '')

		hb.db.timeoutRepo.save({
			at: Date.now(),
			channel: channel,
			duration: duration,
			user: username,
		})
	}
)
