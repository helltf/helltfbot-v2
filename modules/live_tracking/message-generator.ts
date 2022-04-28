import { NotificationMessageInfo, UpdateEventType } from './types.js'

export class MessageGenerator {
	constructor() {}

	generateMessages({
		message,
		notifiedUsers,
	}: NotificationMessageInfo): Map<string, string[]> {
		let messageMap: Map<string, string[]> = new Map()

		for (let {channel, userId} of notifiedUsers) {
			messageMap.set(channel, [message + 'helltf'])
		}

		return messageMap
	}

	addMessageToEntry(
		map: Map<string, string[]>,
		newMessage: string[],
		channel: string
	): Map<string, string[]> {
		let entry = map.get(channel)

		if (entry) {
			entry.push(...newMessage)
		} else {
			map.set(channel, newMessage)
		}

		return map
	}

	concatMaps(
		map1: Map<string, string[]>,
		map2: Map<string, string[]>
	): Map<string, string[]> {
        for(let [channel, messages] of map2){
            this.addMessageToEntry(map1, messages, channel)
        }

		return map1
	}
}
