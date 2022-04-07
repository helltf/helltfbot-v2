import { BotResponse } from "client/bot.js"
import { ChatUserstate } from "tmi.js"

export class Command {
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

	constructor({
		name,
		permissions,
		description,
		requiredParams,
		optionalParams,
		execute,
		cooldown
	}: CommandInfo) {
		this.name = name
		this.permissions = permissions
		this.description = description
		this.requiredParams = requiredParams
		this.optionalParams = optionalParams
		this.execute = execute
		this.cooldown = cooldown
	}
}

interface CommandInfo{
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