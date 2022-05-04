import { customLogMessage } from '../logger/logger-export.js'
import { Client } from 'tmi.js'
import { Command } from '../commands/export/types'
import { Cooldown } from '../commands/export/cooldown.js'
import { DB, DbRepositories } from 'db/export-repositories.js'
import jobs from '../jobs/jobs-export.js'
import { mainJoinAllChannels } from './mainhandlers/join.js'
import { updateCommandsInDb } from '../commands/update-db.js'
import { modules } from '../modules/export/export-modules.js'
import { generateToken } from '../api/twitch/token.js'
import { LogType } from '../logger/log-type.js'
import { PubSub } from '../modules/pubsub/pubsub.js'

export class TwitchBot {
	client: Client
	watchclient: Client
	commands: Map<string, Command>
	cooldown: Cooldown
	db: DB
	twitchAT: string
	log: (type: LogType,...args: any) => void
	pubSub: PubSub

	constructor(client: Client, watchclient: Client) {
		this.log = customLogMessage
		this.client = client
		this.watchclient = watchclient
		this.cooldown = new Cooldown()
		this.pubSub = new PubSub()
	}

	async init(): Promise<TwitchBot> {
		this.twitchAT = await generateToken()
		await this.client.connect()
		await this.watchclient.connect()
		this.pubSub.connect()
		this.log(LogType.TWITCHBOT, 'Successfully logged in')
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

	setRepositories(db: DB) {
		this.db = db
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
		this.log(LogType.JOBS, `${jobs.length} have been initialized`)
	}

	async initModules() {
		for (let module of modules) {
			await module.initialize()
			this.log(LogType.MODULE, `${module.name} has been initialized`)
		}

		this.log(LogType.MODULE, `Successfully initialized ${modules.length} modules`)
	}

	sendMessage(channel: string, message: string){
		this.client.say(channel, message)
	}
}
