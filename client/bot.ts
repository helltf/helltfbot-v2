import { ChatUserstate, Client } from 'tmi.js'

export class TwitchBot {
	client: Client
	watchclient: Client
	commands: Map<string, Command>
	constructor(client: Client, watchclient: Client) {
		this.client = client
		this.watchclient = watchclient
	}
	async init(): Promise<TwitchBot> {
		this.client.connect()
		this.watchclient.connect()
		return this
	}
	setCommands(commands: Command[]) {
		let commandMap = new Map()
	}
}

export class Command {
	name: string
	permissions: number
	description: string
	requiredParams: string[]
	optionalParams: string[]
	execute: (
		channel: string,
		userstate: ChatUserstate,
		message: string
	) => Promise<BotResponse>

	constructor({
		name,
		permissions,
		description,
		requiredParams,
		optionalParams,
		execute,
	}: any) {
		this.name = name
		this.permissions = permissions
		this.description = description
		this.requiredParams = requiredParams
		this.optionalParams = optionalParams
		this.execute = execute
	}
}

export class BotResponse {
	success: boolean
	respone: string
}
