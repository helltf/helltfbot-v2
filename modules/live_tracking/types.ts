import ReconnectingWebSocket from 'reconnecting-websocket'

export interface PubSubData {
	topic: string
	message: JSON
}

export type PubSubType = 'RESPONSE' | 'MESSAGE' | 'PONG' | 'LISTEN'

export type UpdateEventsType = 'LIVE' | 'OFFLINE' | 'TITLE' | 'GAME'

export interface WebSocketConnection {
	connection: ReconnectingWebSocket
	interval: NodeJS.Timer
}

export interface PubSubChannel {
	name: string
	id: number
}

export interface PubSubMessage {
	type: PubSubType
	nonce: string
	data: {
		topics: string[]
		auth_token: string
	}
}

export enum TopicType {
	INFO = 'broadcast-settings-update.',
	LIVE = 'video-playback-by-id.',
}
