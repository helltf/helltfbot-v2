import { ChatUserstate } from "tmi.js"
import { BotResponse } from "../../client/response.js"
import { getUserPermissions } from "../../utilities/twitch/permission.js"
import { CommandInfo } from "./command-info.js"


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

	async isPermitted(user: ChatUserstate): Promise<boolean>{
		return this.permissions > await getUserPermissions(user)
	}
}