import 'dotenv/config'
import { DataSource, Db } from 'typeorm'
import { TwitchBot } from '../../../client/bot.js'
import { mainClient } from '../../../client/main-bot.js'
import { watchClient } from '../../../client/track-bot.js'
import { eventIsNotValid, notify, streamerNotExisting, updateNotification, userHasNotification } from '../../../commands/cmd/notify.js'
import { DB } from '../../../db/export-repositories.js'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import { getOrmConf } from '../../../ormconfig.js'
import { exampleNotificationEntity, exampleTwitchUserEntity, exampleUser } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'

describe('', () => {
	globalThis.hb = new TwitchBot(mainClient, watchClient)
	let channel = 'testChannel'
	let streamer = 'streamer'
    let user = exampleTwitchUserEntity

	beforeAll(async () => {
		let src = new DataSource(getOrmConf())
		hb.db = await new DB(src).initialize()
        user = exampleTwitchUserEntity
	})

	beforeEach(async () => {
		channel = 'testChannel'
		streamer = 'streamer'
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

    it('given streamer does not exist in db return true', async () => {
        let result = await streamerNotExisting(streamer)

        expect(result).toBeTrue()
    })

    
    it('given streamer does not exist in db return true', async () => {
        let exampleNotificationChannel = {
            id: 1,
            name: streamer
        }

        await hb.db.notificationChannelRepo.save({
            ...exampleNotificationChannel
        })

        let result = await streamerNotExisting(streamer)

        expect(result).toBeFalse()
    })

    it('events from UpdateEventType are valid', () => {
        const events = ['live', 'offline', 'title', 'game']

        for(let event of events){
            let isNotValid = eventIsNotValid(event)
            expect(isNotValid).toBeFalse() 
        }
    })

    it('update db entry for user updates notification in db', async() => {
        let event = UpdateEventType.LIVE
        let id = `1`

        await updateNotification(channel, streamer, event, id)

        // let result = 
    })

    it('user has no notification for streamer return false', async() => {
        let id = 1
        let result =  await userHasNotification(id, streamer)

        expect(result).toBeFalse()
    })


    it('user has notification for streamer return true', async() => {
        await hb.db.userRepo.save({
            ...user
        })

        await hb.db.notificationRepo.save({
            ...exampleNotificationEntity
        })

        let result =  await userHasNotification(user.id, streamer)

        expect(result).toBeTrue()
    })
})
