import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { hb } from '../../helltfbot.js'
import { wait } from '../../utilities/timeout.js'

let channels: number[] = [109035947, 85397463]

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

enum TopicType {
	LIVE = 'broadcast-settings-update.',
	INFO = 'video-playback-by-id.',
}

const size = 25

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

const connectPubSub = async() => {
	const chunkedChannels = chunkTopicsInto50(channels)

	for await(let channels of chunkedChannels) {
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

		for await(let channelId of channels) {
			await startPubSubConnection(connection, channelId)
			await wait`5s`
		}
	}
}
const handlePubSubMessage = (data: any) => {
	let message = JSON.parse(data)
	console.log(message)
}

const startPubSubConnection = async (con: ReconnectingWebSocket, channelId: number) => {
	con.addEventListener('message', ({ data }) => {
		handlePubSubMessage(data)
	})

	const liveMessage = createMessageForTopic(TopicType.LIVE, channelId)
	const infoMessage = createMessageForTopic(TopicType.INFO, channelId)
	con.send(JSON.stringify(liveMessage))

	await wait`1s`

	con.send(JSON.stringify(infoMessage))

	hb.log(`Connected to channel ${channelId}`)
}

const createMessageForTopic = (
	topic: TopicType,
	channelId: number
): PubSubMessage => {
	return {
		type: 'LISTEN',
		nonce: '',
		data: {
			auth_token: process.env.TWITCH_OAUTH,
			topics: [`${topic}${channelId}`],
		},
	}
}
const chunkTopicsInto50 = (array: number[]): number[][] => {
	return array.reduce((acc, _, index) => {
		return index % size ? acc : [...acc, array.slice(index, index + size)]
	}, [])
}

export { connectPubSub }
