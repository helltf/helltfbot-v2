import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'

const rmsuggest = new Command({
	name: 'rmsuggest',
	description: 'rmsuggest a feature you want to see',
	permissions: 5,
	requiredParams: ['id'],
	optionalParams: [],
	cooldown: 30000,
	execute: async (
		channel: string,
		user: ChatUserstate,
		[id]: string[]
	): Promise<BotResponse> => {
		if (!id)
			return {
				success: false,
				response: 'You need to specify an id to delete your suggestion',
				channel: channel,
			}
        if(await idIsValidForUser(parseInt(user['user-id']), parseInt(id)))
        return {
            success: false,
            response: `Id ${id} not existing or the suggestion is created by somebody else`,
            channel: channel
        }
	},
})

async function idIsValidForUser(userId: number, suggestionId:number): Promise<boolean>{
    return
}

export { rmsuggest }
