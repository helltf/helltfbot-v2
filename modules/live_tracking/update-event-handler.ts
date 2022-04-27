import {
	PubSubData,
	PubSubMessageEventType,
	SettingMessage,
} from './types.js'

export class UpdateEventHandler {
	constructor() {}

	handleSettingUpdateEvent(
		{ message }: PubSubData<SettingMessage>,
		streamer: string
	): Map<string, string[]> {
		let messages: Map<string, string[]> = new Map()

		if (message.old_status !== message.status) {
			messages = this.addMessageToEntry(
				messages,
				`${streamer} has changed the title to ${message.status}`,
				'helltf'
			)
		}

		if (message.old_game !== message.game) {
			messages = this.addMessageToEntry(
				messages,
				`${streamer} has changed the game to ${message.game}`,
				'helltf'
			)
		}

		return messages
	}

	handleLiveEvent(streamer: string): Map<string, string[]> {
		return new Map([['helltf', [`${streamer} has gone live`]]])
	}

	handleOfflineEvent(streamer: string): Map<string, string[]> {
		return new Map([['helltf', [`${streamer} has gone offline`]]])
	}

	handleUpdate(
		data: PubSubData<any>,
		streamer: string,
		type: PubSubMessageEventType
	): Map<string, string[]> {
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

	addMessageToEntry(
		map: Map<string, string[]>,
		newMessage: string,
		channel: string
	): Map<string, string[]> {
		let entry = map.get(channel)

		if (entry) {
			entry.push(newMessage)
		} else {
			map.set(channel, [newMessage])
		}

		return map
	}
}

export class NotificationHandler {
	constructor() {}

	sendNotifications(notifications: Map<string, string[]>) {
		for (let [channel, messages] of notifications) {
			messages.forEach(m => hb.sendMessage(channel, m))
		}
	}
}
