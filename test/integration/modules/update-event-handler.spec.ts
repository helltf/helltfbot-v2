import 'dotenv/config'
import { UpdateEventHandler } from '../../../modules/pubsub/update-event-handler.js'
import { clearDb } from '../../test-utils/clear.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('Test event handler to return the correct messages', () => {
	let eventHandler: UpdateEventHandler = new UpdateEventHandler()

	beforeEach(async () => {
		eventHandler = new UpdateEventHandler()
		await clearDb(hb.db.dataSource)
	})

	beforeAll(async () => {
		await setupDatabase()
	})

	it('connect to db', () => {
        expect('a').toBe('a')
    })
})
