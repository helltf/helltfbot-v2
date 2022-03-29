import { Client } from 'tmi.js'

class TwitchBot {
	client: Client
	watchclient: Client
	commands: string[]
	constructor(client: Client, watchclient: Client) {
		this.client = client
		this.watchclient = watchclient
	}
	async init(): Promise<TwitchBot> {
		this.client.connect()
		this.watchclient.connect()
        return this
	}
}

export { TwitchBot }
