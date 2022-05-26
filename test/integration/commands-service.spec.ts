import { CommandService } from "../../src/commands/export/commands-service"
import { clearDb } from "../test-utils/clear"
import { disconnectDatabase } from "../test-utils/disconnect"
import { setupDatabase } from "../test-utils/setup-db"

describe('test updating commands', () => {
    beforeAll(async () => {
        await setupDatabase()
    })

    beforeEach(async () => {
        await clearDb(hb.db.dataSource)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

    it('commands are empty add new commands doesn\'t update database', async () => {
        const commands = []
        const commandsService = new CommandService([])

        await commands.addNewCommands()
    })
})