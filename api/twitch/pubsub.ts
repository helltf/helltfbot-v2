import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { wait } from '../../utilities/timeout.js'

let channels: Map<number,string> = new Map([[109035947,'helltf'], [85397463, 'NoWay4u_Sir '], [22484632, 'forsen']])
let nonce = 0

const PubSubMessageHandler = {
	'stream-up': () => console.log('live'),
	'stream-down': () => console.log('offline'),
	'broadcast_settings_update': () => console.log('changed'),
}

type PubSubType = 'RESPONSE' | 'MESSAGE' | 'PONG' | 'LISTEN'
interface WebSocketConnections {
	connection: ReconnectingWebSocket
	interval: NodeJS.Timer
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
	const chunkedChannels = chunkTopicsInto50(channels)

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

		for await (let channelId of channels) {
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
const chunkTopicsInto50 = (array: number[]): number[][] => {
	return array.reduce((acc, _, index) => {
		return index % size ? acc : [...acc, array.slice(index, index + size)]
	}, [])
}

export { connectPubSub }
