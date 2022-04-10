import { ChatUserstate } from 'tmi.js'
import { Command } from '../../commands/export/command.js'
import { hb } from '../../helltfbot.js'
import { getUserPermissions } from '../../utilities/twitch/permission.js'
import { BotResponse } from '../bot.js'

const prefix = process.env.PREFIX
const DEFAULT_ERROR = `Error while executing your command monkaS`

const handleChat = async (channel: string, user: ChatUserstate, message: string) => {
	let [commandLookup, ...data] = message
		.substring(prefix.length)
		.replace(/\s{2,}/g, ' ')
		.split(' ')

	let command = hb.commands.get(commandLookup.toLowerCase())

	if (command === undefined || userHasCooldown(command, user)) return
	if (command.permissions > (await getUserPermissions(user))) return

	setCooldown(command, user)

	let response = await command.execute(channel, user, data)

	sendResponse(response)
}

hb.client.on(
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

		handleChat(channel, user, message)
	}
)

function sendMessage(channel: string, message: string) {
	hb.client.say(channel, message)
}

function sendResponse({ success, response, channel }: BotResponse) {
	if (success) {
		sendMessage(channel, response)
	} else {
		hb.client.say(channel, DEFAULT_ERROR)
	}
}

function setCooldown(command: Command, {"user-id": id}: ChatUserstate) {
	hb.cooldown.setCooldown(command, id)
}

function userHasCooldown(command: Command, {"user-id": id}: ChatUserstate): boolean {
	return hb.cooldown.userHasCooldown(command, id)
}