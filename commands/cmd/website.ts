import { BotResponse } from '../../client/bot.js'
import { Command } from '../../commands/export/command.js'
import { ChatUserstate } from 'tmi.js'

const website = new Command({
    name: 'website',
    description: 'link to my website',
    permissions: 5,
	requiredParams: [],
	optionalParams: [],
    cooldown: 5000,
    execute: async (
		channel: string,
		userstate: ChatUserstate,
		message: string[]
	): Promise<BotResponse> => {
        let response = `You can inspect my website on https://helltf.github.io/bot/#/ `+
        `The website is build with Vue https://vuejs.org/ and the backend is a flask https://flask.palletsprojects.com/en/2.1.x/ python webserver` + 
        ` hosting a GraphQL API `
		
        return new BotResponse(response, channel)
	},
})

export { website }
