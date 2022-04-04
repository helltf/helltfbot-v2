import { BotResponse } from 'client/bot'
import { Command } from 'commands/export/command'
import { ChatUserstate } from 'tmi.js'

const github = new Command({
    name: 'github',
    description: '',
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

export { github }


