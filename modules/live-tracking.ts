import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { wait } from '../utilities/timeout.js'
import { Module } from './export/module.js'

let channels: PubSubChannel[] = [
	{ id: 109035947, name: 'helltf' },
	{ id: 85397463, name: 'NoWay4u_Sir' },
	{ id: 22484632, name: 'forsen' },
]
let nonce = 0

const PubSubMessageHandler = {
	'stream-up': () => console.log('live'),
	'stream-down': () => console.log('offline'),
	broadcast_settings_update: () => console.log('changed'),
}

type PubSubType = 'RESPONSE' | 'MESSAGE' | 'PONG' | 'LISTEN'
interface WebSocketConnections {
	connection: ReconnectingWebSocket
	interval: NodeJS.Timer
}
interface PubSubChannel {
	name: string
	id: number
}
interface PubSubMessage {
	type: PubSubType
	nonce: string
	data: {
		topics: string[]
		auth_token: string
	}
}

enum TopicType {
	INFO = 'broadcast-settings-update.',
	LIVE = 'video-playback-by-id.',
}

const connections: WebSocketConnections[] = []

const setPingInterval = (con: ReconnectingWebSocket): NodeJS.Timer => {
	return setInterval(() => {
		con.send(
			JSON.stringify({
				type: 'PING',
			})
		)
	}, 250 * 1000)
}
function handleIncomingMessage({ data }: any) {
	if (!data?.message) return
	let message = JSON.parse(data.message)

	if (!message) return
	const handler = PubSubMessageHandler[`${message.type}`]

	if (handler) {
		handler(data)
	}
}
const connectPubSub = async () => {
	const chunkedChannels = chunkTopicsIntoSize(channels)

	for await (let channels of chunkedChannels) {
		const connection = new RWS.default('wss://pubsub-edge.twitch.tv', [], {
			WebSocket: WS.WebSocket,
		})

		connection.addEventListener('message', ({ data }) => {
			handlePubSubMessage(JSON.parse(data))
		})

		let conInterval = setPingInterval(connection)

		connection.addEventListener('open', () => {
			connections.push({
				connection: connection,
				interval: conInterval,
			})
		})

		for await (let [channelId, channelName] of channels) {
			await startPubSubConnection(connection, channelId)
			await wait`5s`
		}
	}
}

const handlePubSubMessage = (data: any) => {
	let type: PubSubType = data.type

	if (type !== 'MESSAGE') return

	handleIncomingMessage(data)
}

const sendMessage = (con: ReconnectingWebSocket, message: PubSubMessage) => {
	con.send(JSON.stringify(message))
}
const startPubSubConnection = async (
	con: ReconnectingWebSocket,
	channelId: number
) => {
	const liveMessage = createMessageForTopic(TopicType.LIVE, channelId)
	const infoMessage = createMessageForTopic(TopicType.INFO, channelId)

	sendMessage(con, liveMessage)

	await wait`1s`

	sendMessage(con, infoMessage)
}

const createMessageForTopic = (
	topic: TopicType,
	channelId: number
): PubSubMessage => {
	nonce += 1
	return {
		type: 'LISTEN',
		nonce: `${nonce}`,
		data: {
			auth_token: process.env.TWITCH_OAUTH,
			topics: [`${topic}${channelId}`],
		},
	}
}
const chunkTopicsIntoSize = (
	arr: PubSubChannel[],
	size: number = 25
): PubSubChannel[][] => {
	return arr.reduce(
		(acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
		[]
	)
}
const liveTrackingModule: Module = {
	initialize: connectPubSub,
}
export { liveTrackingModule, chunkTopicsIntoSize }
