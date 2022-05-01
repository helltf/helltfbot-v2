import ReconnectingWebSocket, * as RWS from 'reconnecting-websocket'
import * as WS from 'ws'
import { NotificationChannelInfo } from '../../db/entity/notification_channel.js'
import { LogType } from '../../logger/log-type.js'
import { wait } from '../../utilities/timeout.js'
import { Module } from '../export/module.js'
import { NotificationHandler } from './notification-handler.js'
import {
	WebSocketConnection,
	PubSubType,
	PubSubMessage,
	TopicType,
} from './types.js'
import { UpdateEventHandler } from './update-event-handler.js'
const PUBSUB_URL = 'wss://pubsub-edge.twitch.tv'

export class PubSubConnection implements WebSocketConnection {
	connection: ReconnectingWebSocket
	listenedTopicsLength: number
	interval: NodeJS.Timer

	constructor() {
		this.connection = new RWS.default(PUBSUB_URL, [], {
			WebSocket: WS.WebSocket,
		})

		this.interval = this.setPingInterval()
		this.listenedTopicsLength = 0

		this.connection.addEventListener('message', (message) => {
			this.handleIncomingMessage(message)
		})
	}

	setPingInterval(): NodeJS.Timer {
		return setInterval(() => {
			this.connection.send(
				JSON.stringify({
					type: 'PING',
				})
			)
		}, 250 * 1000)
	}

	listenToTopic(id: number, type: TopicType): TopicType {
		if (this.listenedTopicsLength === 50) {
			return type
		}

		let message = this.createMessageForTopic(type, id)

		this.sendMessage(message)

		this.listenedTopicsLength++
	}

	sendMessage(message: PubSubMessage) {
		this.connection.send(JSON.stringify(message))
	}

	createMessageForTopic = (
		type: TopicType,
		channelId: number
	): PubSubMessage => {
		return {
			type: 'LISTEN',
			nonce: '',
			data: {
				auth_token: process.env.TWITCH_OAUTH,
				topics: [`${type}${channelId}`],
			},
		}
	}
	handleIncomingMessage({ data }: any) {
		let parsedData = JSON.parse(data)
		this.logError(parsedData.error)
	}

	logError(error: any) {
		if (!error) return

		hb.log(LogType.PUBSUB, 'Error occured: ' + error)
	}
}

export class PubSub {
	updateEventHandler: UpdateEventHandler
	notificationHandler: NotificationHandler
	connections: PubSubConnection[] = []

	constructor() {
		this.updateEventHandler = new UpdateEventHandler()
		this.notificationHandler = new NotificationHandler()
	}

	createNewPubSubConnection(): PubSubConnection {
		const connection = new PubSubConnection()

		connection.connection.addEventListener('message', ({ data }) => {
			this.handlePubSubMessage(JSON.parse(data))
		})

		this.connections.push(connection)

		return connection
	}

	async handleIncomingMessage({ data }: any) {
		if (!data?.message) return
		data.message = JSON.parse(data.message)

		if (!data.message) return
		let type = data.message.type
		let streamer = await this.getStreamerForTopic(data.topic)

		if (
			type === 'stream-up' ||
			type === 'stream-down' ||
			type === 'broadcast_settings_update'
		) {
			let messages = await this.updateEventHandler.handleUpdate(
				data,
				streamer,
				type
			)
			this.notificationHandler.sendNotifications(messages)
		}
	}

	connect = async () => {
		hb.log(LogType.PUBSUB, 'Connecting...')

		let channels = await hb.db.notificationChannelRepo.find()
		const chunkedChannels = this.chunkTopicsIntoSize(channels)

		for await(let channels of chunkedChannels) {
			const connection = this.createNewPubSubConnection()

			for await(let { id } of channels) {
				await this.listenToTopics(connection, id)
			}
		}
		
		hb.log(LogType.PUBSUB, 'Successfully connected to Pubsub')
	}

	async listenToTopics(connection: PubSubConnection, id: number) {
		connection.listenToTopic(id, TopicType.LIVE)
		await wait`1s`
		connection.listenToTopic(id, TopicType.INFO)
		await wait`5s`
	}

	handlePubSubMessage = (data: any) => {
		let type: PubSubType = data.type

		if (type !== 'MESSAGE') return

		this.handleIncomingMessage(data)
	}

	sendMessage = (con: ReconnectingWebSocket, message: PubSubMessage) => {
		con.send(JSON.stringify(message))
	}

	chunkTopicsIntoSize = (
		arr: NotificationChannelInfo[],
		size: number = 25
	): NotificationChannelInfo[][] => {
		return arr.reduce(
			(acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
			[]
		)
	}

	async getStreamerForTopic(topic: string): Promise<string> {
		let id = this.getIdForTopic(topic)

		return (
			await hb.db.notificationChannelRepo.findOneBy({
				id: parseInt(id),
			})
		).name
	}

	getIdForTopic(topic: string): string {
		return topic.match(/(?<=\.)\d+/gim)[0]
	}
}
