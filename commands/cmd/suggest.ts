import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'

const suggest = new Command({
	name: 'suggest',
	description: 'suggest a feature you want to see',
	permissions: 5,
	requiredParams: [],
	optionalParams: [],
	cooldown: 5000,
	execute: async (
		channel: string,
		userstate: ChatUserstate,
		[suggestion]: string[]
	): Promise<BotResponse> => {
        if(!suggestion) return {
            response: 'You have to specify a suggestion',
            channel,
            success: false
        }

        await saveSuggestion(suggestion)
		return {
			response: '',
			channel: channel,
			success: true
		}
	},
})
function saveSuggestion(suggestion: string){
    
}
export {suggest}
