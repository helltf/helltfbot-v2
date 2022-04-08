import { ChatUserstate, Client } from 'tmi.js'
import { IdentityOptions } from '../config/config.js'
import { hb } from '../helltfbot.js'
import { BotResponse } from './bot.js'
import { Command } from 'commands/export/command.js'
import { wait } from '../utilities/timeout.js'

const mainClient = createMainClient()
const prefix = process.env.PREFIX
const DEFAULT_ERROR = `Error while executing your command monkaS`
const TWITCH_ERROR_MESSAGE = ['msg_channel_suspended']

function createMainClient(): Client {
	let clientOptions = new IdentityOptions(process.env.TWITCH_OAUTH, 'helltfbot')
	return Client({ identity: clientOptions })
}

mainClient.on(
	'chat',
	async (
		channel: string,
		user: ChatUserstate,
		message: string,
		self: boolean
	) => {
		if (self) return
		if (!message?.toLowerCase()?.startsWith(prefix)) return

		channel = channel.replace('#', '')

		let [commandLookup, ...data] = message
			.substring(prefix.length)
			.replace(/\s{2,}/g, ' ')
			.split(' ')

		let command = hb.commands.get(commandLookup.toLowerCase())

		if (command === undefined || userHasCooldown(command, user)) return

		setCooldown(command, user)

		let response = await command.execute(channel, user, data)

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

function setCooldown(command: Command, user: ChatUserstate) {
	hb.cooldown.setCooldown(command, user['user-id'])
}

function userHasCooldown(command: Command, user: ChatUserstate): boolean {
	return hb.cooldown.userHasCooldown(command, user['user-id'])
}

const mainJoinChannel = async (channel: string) => {
	try {
		await mainClient.join(channel)
	} catch (e) {
		if (TWITCH_ERROR_MESSAGE.includes(e)) {
			hb.db.channelRepo.update(
				{
					channel: channel,
				},
				{
					joined: false,
				}
			)
		}
	}
}

const mainJoinAllChannels = async () => {
	if (process.env.NODE_ENV === 'dev') {
		await hb.client.join(process.env.MAIN_USER)
		return
	}

	let joinedChannels = await hb.db.channelRepo.findBy({
		joined: true,
	})

	for await (let { channel } of joinedChannels) {
		await mainJoinChannel(channel)
		await wait`1s`
	}
}

export { mainClient, mainJoinAllChannels }
