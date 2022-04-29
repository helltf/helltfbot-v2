import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'
import { UpdateEventType } from '../../modules/live_tracking/types.js'
import { Command } from '../export/types.js'

const notify = new Command({
	name: 'notify',
	description: 'notify for events',
	permissions: 5,
	requiredParams: ['streamer', 'event'],
	optionalParams: [],
	cooldown: 5000,
	execute: async (
		channel: string,
		userstate: ChatUserstate,
		[streamer, event]: string[]
	): Promise<BotResponse> => {
		if (!(event in UpdateEventType))
			return getUnknownEventErrorResponse(channel)
            
		return {
			response: 'Successfully created your notification',
			channel: channel,
			success: false,
		}
	},
})

function getUnknownEventErrorResponse(channel: string): BotResponse {
	return {
		response: `Event unknown. Valid events are ${Object.values(
			UpdateEventType
		).join(' ')}`,
		channel: channel,
		success: false,
	}
}

export { notify }
