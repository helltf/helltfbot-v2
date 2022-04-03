import { Command } from '../export/command.js'
import { Userstate } from 'tmi.js'
import { BotResponse } from '../../client/bot.js'

const ping = new Command({
	name: 'ping',
	description: 'ping',
	permissions: 1,
	requiredParams: [],
	optionalParams: [],
	cooldown: 5000,
	execute: async (
		channel: string,
		userstate: Userstate,
		message: string
	): Promise<BotResponse> => {
		return new BotResponse(true, 'pong', channel)
	},
})

export { ping }
