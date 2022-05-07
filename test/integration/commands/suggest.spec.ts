import { suggest } from "../../../commands/cmd/suggest.js"
import { getExampleUserState } from "../../../spec/examples/user.js"
import { clearDb } from "../../test-utils/clear.js"
import { disconnectDatabase } from "../../test-utils/disconnect.js"
import { setupDatabase } from "../../test-utils/setup-db.js"

describe('test suggest command', () => {
    let channel
    let user = getExampleUserState()
    
    beforeAll(async () => {
        channel = 'channel'
        await setupDatabase()
    })
    
    beforeEach(async () => {
		await clearDb(hb.db.dataSource)
	})

    afterAll(async () => {
        await disconnectDatabase()
    })

    it('suggestion is undefined return error', async() => {
        let suggestion = ''
        let response = await suggest.execute(channel, user, [suggestion])

        expect(response.success).toBeFalse()
    })

    it('suggestion is defined and response is successful', async() => {
        let message = ['add']
        let response = await suggest.execute(channel, user, message)

        expect(response.success).toBeTrue()
    })

    it('one word suggestion is defined and saved into db', async() => {
        let message = ['add']
        let response = await suggest.execute(channel, user, message)
        let savedEntity = await hb.db.suggestionRepo.find()
        expect(response.success).toBeTrue()
    })
})