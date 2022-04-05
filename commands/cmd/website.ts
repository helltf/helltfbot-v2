import { BotResponse } from '../../client/bot.js'
import { Command } from '../../commands/export/command.js'
import { ChatUserstate } from 'tmi.js'

const website = new Command({
    name: 'website',
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
        let response = `You can inspect my website on https://helltf.github.io/bot/#/ . `+
        `The website is build with Vue and the backend is a flask python webserver` + 
        ` hosting a GraphQL API `
		
        return new BotResponse(response, channel)
	},
})

export { website }
