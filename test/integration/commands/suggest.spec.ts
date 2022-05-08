import { ChatUserstate } from "tmi.js"
import { suggest } from "../../../commands/cmd/suggest.js"
import { getExampleUserState } from "../../../spec/examples/user.js"
import { clearDb } from "../../test-utils/clear.js"
import { disconnectDatabase } from "../../test-utils/disconnect.js"
import { saveUserStateAsUser } from "../../test-utils/save-user.js"
import { setupDatabase } from "../../test-utils/setup-db.js"

describe('test suggest command', () => {
    let channel: string
    let user: ChatUserstate = getExampleUserState()
    
    beforeAll(async () => {
        channel = 'channel'
        user = getExampleUserState()
        await setupDatabase()
    })
    
    beforeEach(async () => {
		await clearDb(hb.db.dataSource)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
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
        await saveUserStateAsUser(user)

        let response = await suggest.execute(channel, user, message)

        expect(response.success).toBeTrue()
    })

    it('one word suggestion is defined and saved into db', async() => {
        let message = ['add']
        await saveUserStateAsUser(user)
        
        let response = await suggest.execute(channel, user, message)

        let savedEntity = await hb.db.suggestionRepo.find()
        let expectedLength = 1
        let id = 1
        let expectedMessage = `Succesfully saved your suggestion with id ${id}` 

        expect(savedEntity).toHaveSize(expectedLength)
        expect(response.response).toEqual(expectedMessage)
        expect(response.success).toBeTrue()
    })

    it('save multiple words suggestion return succesfull response', async() => {
        let message = ['add', 'this', 'do', 'this']
        let id = 1

        await saveUserStateAsUser(user)

        let response = await suggest.execute(channel, user, message)

        let savedEntity = await hb.db.suggestionRepo.findOneBy({
            id: id
        })

        let expectedMessage = `Succesfully saved your suggestion with id ${id}` 

        expect(savedEntity.suggestion).toBe(`${message.join(' ')}`)
        expect(response.response).toEqual(expectedMessage)
        expect(response.success).toBeTrue()
    })
})

