import { ChatUserstate } from "tmi.js"
import { BotResponse } from "../../client/response.js"

export interface CommandInfo{
	name: string
	permissions: number
	description: string
	requiredParams: string[]
	optionalParams: string[]
	cooldown: number
	execute: (
		channel: string,
		userstate: ChatUserstate,
		message: string[]
	) => Promise<BotResponse>
}