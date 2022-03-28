import { Options } from 'tmi.js'

const getMainClientConfig = (): Options => {
	return new BotOptions()
}

const getTrackClientConfig = (): Options => {
	return new BotOptions()
}

class BotOptions implements Options {
	channels?: string[]
	connection?: {
		server?: string
		port?: number
		reconnect?: boolean
		maxReconnectAttempts?: number
		maxReconnectInverval?: number
		reconnectDecay?: number
		reconnectInterval?: number
		secure?: boolean
		timeout?: number
	}
	identity?: {
		username?: string
		password?: string | (() => string | Promise<string>)
	}
	logger?: {
		info: (message: string) => any
		warn: (message: string) => any
		error: (message: string) => any
	}
	options?: {
		clientId?: string
		debug?: boolean
		joinInterval?: number
		globalDefaultChannel?: string
		messagesLogLevel?: string
		skipMembership?: boolean
		skipUpdatingEmotesets?: boolean
		updateEmotesetsTimer?: number
	}
}

export { getMainClientConfig, getTrackClientConfig }
