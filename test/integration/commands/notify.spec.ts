import 'dotenv/config'
import { DataSource, Db } from 'typeorm'
import { TwitchBot } from '../../../client/bot.js'
import { mainClient } from '../../../client/main-bot.js'
import { watchClient } from '../../../client/track-bot.js'
import {
	eventIsNotValid,
	notify,
	streamerNotExisting,
	updateNotification,
	userHasNotification,
} from '../../../commands/cmd/notify.js'
import { DB } from '../../../db/export-repositories.js'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import { getOrmConf } from '../../../ormconfig.js'
import {
	exampleNotificationEntity,
	exampleTwitchUserEntity,
	exampleUser,
} from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { Notification } from '../../../db/export-entities.js'

describe('', () => {
	globalThis.hb = new TwitchBot(mainClient, watchClient)
	let channel = 'testChannel'
	let streamer = 'streamer'
	let user = exampleTwitchUserEntity
	let notification = exampleNotificationEntity

	beforeAll(async () => {
		let src = new DataSource(getOrmConf())
		hb.db = await new DB(src).initialize()
	})

	beforeEach(async () => {
		channel = 'testChannel'
		streamer = 'streamer'
		notification = exampleNotificationEntity
		user = exampleTwitchUserEntity

		await clearDb(hb.db.dataSource)
	})

	afterAll(async () => {
		await clearDb(hb.db.dataSource)
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
            id: 1
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

	it('update new db entry for user updates the notificatin', async () => {
		let event = UpdateEventType.LIVE
		await hb.db.userRepo.save(user)
		await hb.db.notificationRepo.save(notification)

		await updateNotification(channel, streamer, event, `${user.id}`)

        let result = await findNotification(user.id, streamer)

        expect(result.live).toBeTruthy()
	})

	it('user has no notification for streamer return false', async () => {
		let id = 1
		let result = await userHasNotification(id, streamer)

		expect(result).toBeFalse()
	})

	it('user has notification for streamer return true', async () => {
		await hb.db.userRepo.save(user)

		await hb.db.notificationRepo.save(notification)

		let result = await userHasNotification(user.id, streamer)

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
