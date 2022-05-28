import { NotificationService } from "../../../src/service/notification.service.js"
import { clearDb } from "../../test-utils/clear.js"
import { disconnectDatabase } from "../../test-utils/disconnect.js"
import { setupDatabase } from "../../test-utils/setup-db.js"


describe('test notificatin service', () => {
    let service: NotificationService

    beforeAll(async () => {
        await setupDatabase()
    })

    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
        service = new NotificationService()
        await clearDb(hb.db.dataSource)
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

})