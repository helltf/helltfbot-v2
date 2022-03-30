import { Userstate } from 'tmi.js'
import { BotResponse, Command } from '../../client/bot.js'

const ping = new Command({
	name: 'ping',
	description: 'ping',
	permissions: 1,
	requiredParams: [],
	optionalParams: [],
	execute: async (
		channel: string,
		userstate: Userstate,
		message: string
	): Promise<BotResponse> => {
		return new BotResponse(true, 'pong', channel)
	},
})

export { ping }
