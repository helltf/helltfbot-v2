import 'dotenv/config'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import { UpdateEventHandler } from '../../../modules/pubsub/update-event-handler.js'
import { getExampleNotificationEntity } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { Notification } from '../../../db/entity/notification.js'

describe('Test event handler to return the correct messages', () => {
	let eventHandler: UpdateEventHandler = new UpdateEventHandler()
    let streamer: string
    let notification: Notification

	beforeEach(async () => {
        streamer = `streamer`
        notification = await getExampleNotificationEntity()
		eventHandler = new UpdateEventHandler()
		await clearDb(hb.db.dataSource)
	})

	beforeAll(async () => {
		await setupDatabase()
	})

	it('get notified user no user existing return empty array', async() => {
        let type = UpdateEventType.LIVE

        let result = await eventHandler.getNotifiedUsers(streamer, type)
        let expectedResult = []

        expect(result).toEqual(expectedResult)
    })

    it('get notified user user has notification return 1 notification', async() => {
        let type = UpdateEventType.LIVE
        notification[type] = true

        await hb.db.userRepo.save(notification.user)
        await hb.db.notificationRepo.save(notification)

        let result = await eventHandler.getNotifiedUsers(streamer, type)

        let expectedResult = 1

        expect(result).toHaveSize(expectedResult)
    })
})
