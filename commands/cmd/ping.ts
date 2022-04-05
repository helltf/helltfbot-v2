import { Command } from '../export/command.js'
import { ChatUserstate, Userstate } from 'tmi.js'
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
		userstate: ChatUserstate,
		message: string[]
	): Promise<BotResponse> => {
		return new BotResponse('pong', channel)
	},
})

export { ping }
