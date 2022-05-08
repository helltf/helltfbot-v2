import 'dotenv/config'
import {
	eventIsNotValid,
	notify,
	streamerNotExisting,
	updateNotification,
	userHasNotification,
} from '../../../commands/cmd/notify.js'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import {
	exampleUser,
	getExampleNotificationEntity,
	getTwitchUserEntity,
} from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { Notification, TwitchUser } from '../../../db/export-entities.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'

describe('test notify command', () => {
	let channel = 'testChannel'
	let streamer = 'streamer'
	let user: TwitchUser
	let notification: Notification

	beforeAll(async () => {
		await setupDatabase()
	})

	beforeEach(async () => {
		channel = 'testChannel'
		streamer = 'streamer'
		notification = getExampleNotificationEntity()
		user = getTwitchUserEntity()
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
		await clearDb(hb.db.dataSource)
	})

	afterAll(async () => {
		await disconnectDatabase()
	})

	it('event is not valid return error', async () => {
		let event = 'unknown'
		let response = await notify.execute(channel, exampleUser, [streamer, event])

		expect(response.channel).toBe(channel)
		expect(response.success).toBeFalse()
		expect(response.response).toEqual(
			`Event unknown. Valid events are ${Object.values(UpdateEventType).join(
				' '
			)}`
		)
	})

	it('given streamer does exist in db return false', async () => {
		let result = await streamerNotExisting(streamer)

		expect(result).toBeTrue()
	})

	it('given streamer does not exist in db return true', async () => {
		await hb.db.notificationChannelRepo.save({
			name: streamer,
			id: 1,
		})

		let result = await streamerNotExisting(streamer)

		expect(result).toBeFalse()
	})

	it('events from UpdateEventType are valid', () => {
		const events = ['live', 'offline', 'title', 'game']

		for (let event of events) {
			let isNotValid = eventIsNotValid(event)
			expect(isNotValid).toBeFalse()
		}
	})

	it('save new db entry for notification creates new entry in db', async () => {
		let event = UpdateEventType.LIVE
		await hb.db.userRepo.save(user)

		await updateNotification(channel, streamer, event, `${user.id}`)

		let result = await findNotification(user.id, streamer)

		expect(result.live).toBeTruthy()
	})

	it('update new db entry for user updates the notification', async () => {
		let event = UpdateEventType.LIVE
		await hb.db.userRepo.save(notification.user)
		await hb.db.notificationRepo.save(notification)

		await updateNotification(channel, streamer, event, `${notification.user.id}`)

		let result = await findNotification(notification.user.id, streamer)

		expect(result.live).toBeTruthy()
	})

	it('user has no notification for streamer return false', async () => {
		let id = 1
		let result = await userHasNotification(id, streamer)

		expect(result).toBeFalse()
	})

	it('user has notification for streamer return true', async () => {
		await hb.db.userRepo.save(notification.user)

		await hb.db.notificationRepo.save(notification)

		let result = await userHasNotification(notification.user.id, streamer)

		expect(result).toBeTrue()

	})
})

async function findNotification(
	userId: number,
	streamer: string
): Promise<Notification> {
	return hb.db.notificationRepo.findOne({
		where: {
			user: {
				id: userId,
			},
			streamer: streamer,
		},
		relations: {
			user: true,
		},
	})
}
