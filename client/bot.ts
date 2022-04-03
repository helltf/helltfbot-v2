import { Command } from '../commands/export/command'
import { Client } from 'tmi.js'
import { Cooldown } from '../commands/export/cooldown.js'

export class TwitchBot {
	client: Client
	watchclient: Client
	commands: Map<string, Command>
	cooldown: Cooldown

	constructor(client: Client, watchclient: Client) {
		this.client = client
		this.watchclient = watchclient
		this.cooldown = new Cooldown()
	}

	async init(): Promise<TwitchBot> {
		await this.client.connect()
		await this.watchclient.connect()
		return this
	}

	setCommands(commands: Command[]) {
		let commandMap = new Map<string, Command>()

		for (let command of commands) {
			commandMap.set(command.name, command)
		}

		this.commands = commandMap
	}
}

export class BotResponse {
	success: boolean
	response: string
	channel: string

	constructor(success: boolean, response: string, channel: string) {
		this.success = success
		this.response = response
		this.channel = channel
	}
}
