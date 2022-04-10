import { Client } from 'tmi.js'
import { IdentityOptions } from '../config/config.js'

const mainClient = createMainClient()

function createMainClient(): Client {
	let identity = new IdentityOptions(process.env.TWITCH_OAUTH, 'helltfbot')

	return Client({ identity })
}

export { mainClient }
