import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'
import { Suggestion } from '../../db/export-entities.js'

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
		if (await idIsNotValidForUser(user['user-id'], id))
			return {
				success: false,
				response: `Id ${id} not existing or the suggestion is created by somebody else`,
				channel: channel,
			}
        
        await deleteSuggestion(id)

        return {
            response: `Succesfully removed your suggestion with id ${id}`,
            channel: channel,
            success: true
        }
	},
})

async function idIsNotValidForUser(
	userId: string,
	suggestionId: string
): Promise<boolean> {
	let parsedUserId = parseInt(userId)
	let parsedSuggestionId = parseInt(suggestionId)

    let entity = await hb.db.suggestionRepo.findOne({
        where:{
            id: parsedSuggestionId,
            user: {
                id: parsedUserId
            }
        },
        relations: {
            user: true
        }
    }
    )
	return entity === null
}

async function deleteSuggestion(suggestionId: string) {
    let parsedSuggestionId = parseInt(suggestionId)

    await hb.db.suggestionRepo.delete({
        id: parsedSuggestionId
    })
}

export { rmsuggest }
