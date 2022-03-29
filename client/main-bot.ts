import { ChatUserstate, Client } from 'tmi.js'
import * as tmi from 'tmi.js'
import { IdentityOptions } from '../config/config.js'
import { hb } from '../helltfbot.js'

const mainClient = createMainClient()

function createMainClient (): Client {
    let clientOptions = new IdentityOptions(process.env.TWITCH_OAUTH, "helltfbot")
    return tmi.Client({identity: clientOptions})
}


mainClient.on(
	'chat',
	(
		channel: string,
		userstate: ChatUserstate,
		message: string,
		self: boolean
	) => {
    }
)


export { mainClient }
