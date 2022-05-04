import { DataSource } from "typeorm"
import { TwitchBot } from "../../../client/bot.js"
import { mainClient } from "../../../client/main-bot.js"
import { watchClient } from "../../../client/track-bot.js"
import { DB } from "../../../db/export-repositories.js"
import { getOrmConf } from "../../../ormconfig.js"
import { clearDb } from "../../test-utils/clear.js"

describe('', () => {
    globalThis.hb = new TwitchBot(mainClient, watchClient)

    beforeAll(async()=>{
        let src = new DataSource(getOrmConf())
        hb.db = await new DB(src).initialize()
    })

    beforeEach(async()=>{
        await clearDb(hb.db.dataSource)
    })

    afterAll(async()=>{
        await clearDb(hb.db.dataSource)
    })

    it('', async()=> {
        await hb.db.userRepo.save({
            color: '',
            display_name:'a',
            id:1,
            name:'a',
            permission: 1,
            notifications:[],
            registered_at: Date.now()
        })

        let entity = await hb.db.userRepo.count()

        expect(entity).toBe(1)
    })

    it('', async()=> {
        await hb.db.userRepo.save({
            color: '',
            display_name:'a',
            id:1,
            name:'a',
            permission: 1,
            notifications:[],
            registered_at: Date.now()
        })

        let entity = await hb.db.userRepo.count()

        expect(entity).toBe(1)
    })
})