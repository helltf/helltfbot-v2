import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { wait } from '../../utilities/timeout.js'

interface Topic {
	topic: string
	channel: string
	channelId: number
}

interface WebSocketConnections {
	connection: ReconnectingWebSocket
	interval: NodeJS.Timer
}

interface PubSubMessage {
	type: string
	nonce: string
	data: {
		topics: string[]
		auth_token: string
	}
}

const size = 25

const connections: WebSocketConnections[] = []

const topics: Topic[] = [
	{
		topic: 'broadcast-settings-update.109035947',
		channel: 'helltf',
		channelId: 109035947,
	},
]

const setPingInterval = (con: ReconnectingWebSocket): NodeJS.Timer => {
	return setInterval(() => {
		con.send(
			JSON.stringify({
				type: 'PING',
			})
		)
	}, 250 * 1000)
}

const connectPubSub = () => {
	const newConnections = chunkTopicsInto50(topics)

	for (let newConnection of newConnections) {
		const connection = new RWS.default('wss://pubsub-edge.twitch.tv', [], {
			WebSocket: WS.WebSocket,
		})

		let conInterval = setPingInterval(connection)

		connection.addEventListener('open', () => {
			connections.push({
				connection: connection,
				interval: conInterval,
			})
		})

		startPubSubConnection(connection)
	}
}
const handlePubSubMessage = (data: any) => {
	console.log(data)
}
const startPubSubConnection = async (con: ReconnectingWebSocket) => {
	con.addEventListener('message', ({data}) => {
		handlePubSubMessage(data)
	})

	const liveMessage = createMessageForTopic('video-playback-by-id.22484632')
	const infoMessage = createMessageForTopic(
		'broadcast-settings-update.109035947'
	)
	con.send(JSON.stringify(liveMessage))

	await wait`1s`

	con.send(JSON.stringify(infoMessage))
}

const createMessageForTopic = (topic: string): PubSubMessage => {
	return {
		type: 'LISTEN',
		nonce: '',
		data: {
			auth_token: process.env.TWITCH_OAUTH,
			topics: [topic],
		},
	}
}
const chunkTopicsInto50 = (array: Topic[]): Topic[][] => {
	return array.reduce((acc, _, index) => {
		return index % size ? acc : [...acc, array.slice(index, index + size)]
	}, [])
}

export { connectPubSub }
