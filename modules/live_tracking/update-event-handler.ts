import { Notification } from '../../db/export-entities.js'
import { MessageGenerator } from './message-generator.js'
import {
	NotificationMessageInfo,
	PubSubData,
	PubSubMessageEventType,
	SettingMessage,
	UpdateEventType,
} from './types.js'

export class UpdateEventHandler {
	messageGenerator: MessageGenerator

	constructor() {
		this.messageGenerator = new MessageGenerator()
	}

	async handleUpdate(
		data: PubSubData<any>,
		streamer: string,
		type: PubSubMessageEventType
	): Promise<Map<string, string[]>> {
		if (type === 'stream-up') {
			return this.handleLiveEvent(streamer)
		}

		if (type === 'stream-down') {
			return this.handleOfflineEvent(streamer)
		}

		if (type === 'broadcast_settings_update') {
			return this.handleSettingUpdateEvent(data, streamer)
		}
	}

	async handleSettingUpdateEvent(
		{ message }: PubSubData<SettingMessage>,
		streamer: string
	): Promise<Map<string, string[]>> {
		let titleMessages = new Map<string, string[]>()
		let gameMessages = new Map<string, string[]>()
		
		if (message.old_status !== message.status) {
			let notificationMessageInfo = await this.getNotificationMessageInfo(
				UpdateEventType.TITLE,
				streamer,
				message.status
			)

			titleMessages =  this.messageGenerator.generateMessages(notificationMessageInfo)
		}

		if (message.old_game !== message.game) {
			let notificationMessageInfo = await this.getNotificationMessageInfo(
				UpdateEventType.GAME,
				streamer,
				message.game
			)

			gameMessages = this.messageGenerator.generateMessages(notificationMessageInfo)
		}

	
		return this.messageGenerator.concatMaps(titleMessages, gameMessages)
	}

	async handleLiveEvent(streamer: string): Promise<Map<string, string[]>> {
		let notificationMessageInfo = await this.getNotificationMessageInfo(
			UpdateEventType.OFFLINE,
			streamer
		)

		return this.messageGenerator.generateMessages(notificationMessageInfo)
	}

	async handleOfflineEvent(streamer: string): Promise<Map<string, string[]>> {
		let notificationMessageInfo = await this.getNotificationMessageInfo(
			UpdateEventType.OFFLINE,
			streamer
		)

		return this.messageGenerator.generateMessages(notificationMessageInfo)
	}

	async getNotifiedUsers(
		streamer: string,
		event: UpdateEventType
	): Promise<Notification[]> {
		let users = hb.db.notificationRepo.find({
			where: {
				streamer: streamer,
				[event]: true,
			},
			relations:{
				user: true
			}
		})
		return users
	}

	getNotificationMessage(
		type: UpdateEventType,
		streamer: string,
		value: string | undefined
	): string {
		if (type === UpdateEventType.LIVE) return `@${streamer} has gone live `
		if (type === UpdateEventType.OFFLINE) return `@${streamer} has gone offline `
		if (type === UpdateEventType.GAME)
			return `@${streamer} has changed the game to ${value} `
		if (type === UpdateEventType.TITLE)
			return `@${streamer} has changed the title to ${value} `
	}

	async getNotificationMessageInfo(
		type: UpdateEventType,
		streamer: string,
		value: string | undefined = undefined
	): Promise<NotificationMessageInfo> {
		let notifiedUsers = await this.getNotifiedUsers(streamer, type)
		let message = this.getNotificationMessage(type, streamer, value)

		return {
			message: message,
			notifiedUsers: notifiedUsers,
			streamer: streamer,
			type: type,
		}
	}
}
