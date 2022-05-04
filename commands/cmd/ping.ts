import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'

const ping = new Command({
	name: 'ping',
	description: 'just a ping command',
	permissions: 5,
	requiredParams: [],
	optionalParams: [],
	cooldown: 5000,
	execute: async (
		channel: string,
		userstate: ChatUserstate,
		message: string[]
	): Promise<BotResponse> => {
		return {
			response: 'pong',
			channel: channel,
			success: true
		}
	},
})

export {ping}
