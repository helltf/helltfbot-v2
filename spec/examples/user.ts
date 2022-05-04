import { ChatUserstate } from 'tmi.js'
import { NotificationInfo } from '../../db/entity/notification.js'
import { TwitchUser } from '../../db/export-entities.js'

export const exampleUser: ChatUserstate = {
	username: 'helltf',
	'user-id': '109035947',
	color: '#FFFFFF',
	badges: {
		broadcaster: '1',
	},
}

export const exampleTwitchUserEntity = {
	id: 1,
	name: 'user',
	color: '#ffffff',
	permission: 0,
	registered_at: Date.now(),
	display_name: 'user',
	notifications: [],
}

const getTwitchUserEntity = (): TwitchUser => {
	let user = new TwitchUser()

	const {
		id,
		name,
		color,
		permission,
		registered_at,
		display_name,
		notifications,
	} = exampleTwitchUserEntity

	user.id = id
	user.name = name
	user.color = color
	user.permission = permission
	user.display_name = display_name
	user.registered_at = registered_at
	user.notifications = notifications

	return user
}

export const exampleNotificationEntity: NotificationInfo = {
	streamer: 'streamer',
	channel: 'channel',
	live: false,
	offline: false,
	title: false,
	game: false,
	user: getTwitchUserEntity(),
}
