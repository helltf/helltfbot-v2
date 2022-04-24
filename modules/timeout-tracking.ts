import { hb } from '../helltfbot.js'
import { Module } from './export/module.js'

const initialize = () => {
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
	
}
const timeoutModule: Module = {
	initialize: initialize
}

export { timeoutModule }