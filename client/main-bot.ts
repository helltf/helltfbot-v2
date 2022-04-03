import { ChatUserstate, Client } from 'tmi.js'
import * as tmi from 'tmi.js'
import { IdentityOptions } from '../config/config.js'
import { hb } from '../helltfbot.js'
import { BotResponse } from './bot.js'

const mainClient = createMainClient()
const prefix = process.env.PREFIX
const DEFAULT_ERROR = `Error while executing your command monkaS`

function createMainClient(): Client {
	let clientOptions = new IdentityOptions(process.env.TWITCH_OAUTH, 'helltfbot')
	return tmi.Client({ identity: clientOptions })
}

mainClient.on(
	'chat',
	async (
		channel: string,
		userstate: ChatUserstate,
		message: string,
		self: boolean
	) => {
		if (self) return
		if (!message?.toLowerCase()?.startsWith(prefix)) return

		channel = channel.replace('#', '')

		let [commandName, ...data] = message
			.substring(prefix.length)
			.replace(/\s{2,}/g, ' ')
			.split(' ')

		let command = hb.commands.get(commandName)

		if (command === undefined) return

		let response = await command.execute(channel, userstate, data)

		sendResponse(response)
	}
)

function sendMessage(channel: string, message: string) {
	mainClient.say(channel, message)
}

function sendResponse({ success, response, channel }: BotResponse) {
	if (success) {
		sendMessage(channel, response)
	} else {
		mainClient.say(channel, DEFAULT_ERROR)
	}
}

export { mainClient }
