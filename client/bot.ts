import { PrismaClient } from '@prisma/client'
import { Client } from 'tmi.js'
import { Command } from '../commands/export/command'
import { Cooldown } from '../commands/export/cooldown.js'

export class TwitchBot {
	client: Client
	watchclient: Client
	commands: Map<string, Command>
	database: PrismaClient
	cooldown: Cooldown

	constructor(client: Client, watchclient: Client, db: PrismaClient) {
		this.client = client
		this.watchclient = watchclient
		this.database = db
		this.cooldown = new Cooldown
	}

	async init(): Promise<TwitchBot> {
		await this.client.connect()
		await this.watchclient.connect()
		await this.database.$connect()
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

	constructor(response: string, channel: string, success: boolean = true) {
		this.success = success
		this.response = response
		this.channel = channel
	}
}
