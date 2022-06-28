import { StatsCommand } from "@src/commands/cmd/stats"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { setupDatabase } from "@test-utils/setup-db"

describe('stats command', () => {
    let stats: StatsCommand
    beforeAll(async () => {
        await setupDatabase()
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

    beforeEach(async () => {
        stats = new StatsCommand()
        await clearDb(hb.db.dataSource)
    })

    it('type is not available return error', async () => {

    })
})