import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { wait } from '../../utilities/timeout.js'
import { Module } from '../export/module.js'
import {
	WebSocketConnection,
	PubSubChannel,
	PubSubData,
	PubSubType,
	PubSubMessage,
	TopicType,
} from './types.js'

const connections: WebSocketConnection[] = []

let channels: PubSubChannel[] = [
	{ id: 109035947, name: 'helltf' },
	{ id: 85397463, name: 'NoWay4u_Sir' },
	{ id: 22484632, name: 'forsen' },
	{ id: 31545223, name: 'agurin' },
]
const handleLiveEvent = (data: PubSubData) => {
	let name = getNameForTopic(data.topic)

	console.log(`${name} has gone live`)
}
const handleOfflineEvent = (data: PubSubData) => {
	let name = getNameForTopic(data.topic)

	console.log(`${name} has gone offline`)
}
const handleSettingUpdateEvent = (data: PubSubData) => {
	let name = getNameForTopic(data.topic)

	console.log(`${name} has updated the settings`)
}
const PubSubMessageHandler = {
	'stream-up': (data: PubSubData) => handleLiveEvent(data),
	'stream-down': (data: PubSubData) => handleOfflineEvent(data),
	broadcast_settings_update: (data: PubSubData) =>
		handleSettingUpdateEvent(data),
}

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

		for await (let { id } of channels) {
			await startListenToTopics(connection, id)
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

const startListenToTopics = async (
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
	return {
		type: 'LISTEN',
		nonce: '',
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
function getNameForTopic(topic: string): string {
	let id = getIdForTopic(topic)

	let { name } = channels.find((c) => c.id === parseInt(id))

	return name
}

function getIdForTopic(topic: string): string {
	return topic.match(/(?<=\.)\d+/gim)[0]
}

const liveTrackingModule: Module = {
	initialize: connectPubSub,
}

export {
	liveTrackingModule,
	chunkTopicsIntoSize,
	getNameForTopic,
	getIdForTopic,
}
