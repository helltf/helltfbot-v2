import 'dotenv/config'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import { UpdateEventHandler } from '../../../modules/pubsub/update-event-handler.js'
import { getExampleNotificationEntity } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { Notification } from '../../../db/entity/notification.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'

describe('Test event handler to return the correct messages', () => {
	let eventHandler: UpdateEventHandler = new UpdateEventHandler()
    let streamer: string

	beforeEach(async () => {
        streamer = `streamer`
		eventHandler = new UpdateEventHandler()
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
		await clearDb(hb.db.dataSource)
	})

	beforeAll(async () => {
		await setupDatabase()
	})

    afterAll(async ()=> {
        await disconnectDatabase()
    })

	it('get notified user no user existing return empty array', async() => {
        let type = UpdateEventType.LIVE

        let result = await eventHandler.getNotifiedUsers(streamer, type)
        let expectedResult = []

        expect(result).toEqual(expectedResult)
    })

    it('get notified user, user has notification return 1 notification', async() => {
        let type = UpdateEventType.LIVE
        let notification = getExampleNotificationEntity()
        notification[type] = true

        await hb.db.userRepo.save(notification.user)
        await hb.db.notificationRepo.save(notification)

        let result = await eventHandler.getNotifiedUsers(streamer, type)

        let expectedResult = 1

        expect(result).toHaveSize(expectedResult)
    })

    it('get notified user, 2 users have notifications return 2 notification', async() => {
        let type = UpdateEventType.LIVE
        let notification1 = getExampleNotificationEntity()
        let notification2 = getExampleNotificationEntity()
        notification1[type] = true
        notification2[type] = true
        notification2.user.id = 2
        notification2.channel = 'channel2'

        await saveNotificationWithUser(notification1)
        await saveNotificationWithUser(notification2)
        let result = await eventHandler.getNotifiedUsers(streamer, type)

        let expectedResult = 2

        expect(result).toHaveSize(expectedResult)
    })

    it('get notified user, 2 users have notifications on different events return 1 notification', async() => {
        let type = UpdateEventType.LIVE
        let notification1 = getExampleNotificationEntity()
        let notification2 = getExampleNotificationEntity()

        notification1[type] = true
        notification2[UpdateEventType.GAME] = true
        notification2.user.id = 2
        notification2.channel = 'channel2'

        await saveNotificationWithUser(notification1)
        await saveNotificationWithUser(notification2)

        let result = await eventHandler.getNotifiedUsers(streamer, type)

        let expectedResult = 1

        expect(result).toHaveSize(expectedResult)
    })
})

async function saveNotificationWithUser(notification: Notification){
    await hb.db.userRepo.save(notification.user)
    await hb.db.notificationRepo.save(notification)
}
