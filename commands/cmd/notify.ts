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
		user: ChatUserstate,
		[streamer, event]: string[]
	): Promise<BotResponse> => {
		if (eventIsNotValid(event))
			return getUnknownEventErrorResponse(channel)

        if(await streamerAlreadyExists(streamer)){
            await updateNotification(channel, streamer, event as UpdateEventType, user['user-id'])
        }else{

        } 

		return {
			response: 'Successfully created your notification',
			channel: channel,
			success: true,
		}
	},
})
async function streamerAlreadyExists(streamer: string): Promise<boolean>{
    return await hb.db.notificationChannelRepo.findOneBy({name: streamer}) !== undefined
}
function eventIsNotValid(event: string){
    return !(Object.values(UpdateEventType).includes(event as UpdateEventType))
}
async function updateNotification(channel: string, streamer: string, event: UpdateEventType, id: string){
    let parsedId = parseInt(id)
    let user = await hb.db.userRepo.findOneBy({id: parsedId})

    if(await userHasNotification(parsedId, streamer)) {
        await hb.db.notificationRepo.update({
            user:{
                id: parsedId
            }
        },{
            [event]: true
        })
    }else{
        await hb.db.notificationRepo.save({
            channel: channel,
            streamer: streamer,
            [event]: true,
            user: user
        })
    }
}

async function userHasNotification(id:number, streamer: string): Promise<boolean>{
    return await hb.db.notificationRepo.findOneBy({
        user:{
            id: id
        },
        streamer: streamer
    }) !== undefined
}

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
