import { BotResponse } from '../../client/bot.js'
import { Command } from '../../commands/export/command.js'
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
        let response = `You can find my github profile by following this link https://github.com/helltf . ` + 
        `Feel free to leave a follow <3 To visit the github page for this bot go to https://github.com/helltf/helltfbot-v2`

		return new BotResponse(response, channel)
	},
})

export { github }


