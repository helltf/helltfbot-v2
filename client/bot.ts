import { customLogMessage } from '../logger/logger-export.js'
import { Client } from 'tmi.js'
import { Command } from '../commands/export/command'
import { Cooldown } from '../commands/export/cooldown.js'
import { DbRepositories } from 'db/export-repositories.js'
import { initializeColorTracking } from '../modules/color-tracking.js'
import jobs from '../jobs/jobs-export.js'
import { mainJoinAllChannels } from './mainhandlers/join.js'
import { updateCommandsInDb } from '../commands/update-db.js'

export class TwitchBot {
	client: Client
	watchclient: Client
	commands: Map<string, Command>
	cooldown: Cooldown
	db: DbRepositories
	log: (...args: any) => void

	constructor(client: Client, watchclient: Client) {
		this.log = customLogMessage
		this.client = client
		this.watchclient = watchclient
		this.cooldown = new Cooldown()
	}

	async init(): Promise<TwitchBot> {
		await this.client.connect()
		await this.watchclient.connect()
		this.log('Successfully logged in')
		updateCommandsInDb()
		return this
	}

	setCommands(commands: Command[]) {
		let commandMap = new Map<string, Command>()

		for (let command of commands) {
			commandMap.set(command.name, command)
		}

		this.commands = commandMap
	}

	setRepositories(repos: DbRepositories) {
		this.db = repos
	}

	async joinChannels() {
		mainJoinAllChannels()
		mainJoinAllChannels()
	}

	startJobs() {
		if (process.env.NODE_ENV === 'dev') return

		for (let { delay, execute } of jobs) {
			execute()
			setInterval(execute, delay)
		}
	}

	initModules() {
		initializeColorTracking()
	}
}

