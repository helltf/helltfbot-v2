import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { wait } from '../../utilities/timeout.js'
import { Module } from '../export/module.js'
import {
	WebSocketConnection,
	PubSubChannel,
	PubSubType,
	PubSubMessage,
	TopicType,
} from './types.js'
import { NotificationHandler, UpdateEventHandler } from './update-event-handler.js'
const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

const channels: PubSubChannel[] = [
	{ id: 109035947, name: 'helltf' },
	{ id: 85397463, name: 'NoWay4u_Sir' },
	{ id: 22484632, name: 'forsen' },
	{ id: 31545223, name: 'agurin' },
]

export class LiveTracking implements Module {
	channels: PubSubChannel[]
	updateEventHandler: UpdateEventHandler
	connections: WebSocketConnection[]
	notificationHandler: NotificationHandler
	name: string = 'LiveTracking'

	constructor() {
		this.updateEventHandler = new UpdateEventHandler()
		this.notificationHandler = new NotificationHandler()
		this.connections = []
	}

	async initialize() {
		this.channels = channels
		await this.connectPubSub()
	}

	setPingInterval(con: ReconnectingWebSocket): NodeJS.Timer {
		return setInterval(() => {
			con.send(
				JSON.stringify({
					type: 'PING',
				})
			)
		}, 250 * 1000)
	}

	handleIncomingMessage({ data }: any) {
		if (!data?.message) return
		data.message = JSON.parse(data.message)

		if (!data.message) return
		let type = data.message.type
		let streamer = this.getStreamerForTopic(data.topic)

		if (
			type === 'stream-up' || type === 'stream-down' || type === 'broadcast_settings_update'
		) {
			let messages = this.updateEventHandler.handleUpdate(data, streamer, type)
			this.notificationHandler.sendNotifications(messages)
		}

	}

	connectPubSub = async () => {
		const chunkedChannels = this.chunkTopicsIntoSize(channels)

		for await (let channels of chunkedChannels) {
			const connection = new RWS.default(PUBSUB_URL, [], {
				WebSocket: WS.WebSocket,
			})

			connection.addEventListener('message', ({ data }) => {
				this.handlePubSubMessage(JSON.parse(data))
			})

			let conInterval = this.setPingInterval(connection)

			connection.addEventListener('open', () => {
				this.connections.push({
					connection: connection,
					interval: conInterval,
				})
			})

			for await (let { id } of channels) {
				await this.startListenToTopics(connection, id)
				await wait`5s`
			}
		}
	}

	handlePubSubMessage = (data: any) => {
		let type: PubSubType = data.type

		if (type !== 'MESSAGE') return

		this.handleIncomingMessage(data)
	}

	sendMessage = (con: ReconnectingWebSocket, message: PubSubMessage) => {
		con.send(JSON.stringify(message))
	}

	startListenToTopics = async (
		con: ReconnectingWebSocket,
		channelId: number
	) => {
		const liveMessage = this.createMessageForTopic(TopicType.LIVE, channelId)
		const infoMessage = this.createMessageForTopic(TopicType.INFO, channelId)

		this.sendMessage(con, liveMessage)

		await wait`1s`

		this.sendMessage(con, infoMessage)
	}
	createMessageForTopic = (
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
	chunkTopicsIntoSize = (
		arr: PubSubChannel[],
		size: number = 25
	): PubSubChannel[][] => {
		return arr.reduce(
			(acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
			[]
		)
	}
	getStreamerForTopic(topic: string): string {
		let id = this.getIdForTopic(topic)

		let { name } = channels.find((c) => c.id === parseInt(id))

		return name
	}
	getIdForTopic(topic: string): string {
		return topic.match(/(?<=\.)\d+/gim)[0]
	}
}
