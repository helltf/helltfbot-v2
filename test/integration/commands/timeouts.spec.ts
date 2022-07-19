import { BanEntity, TwitchUserEntity } from "@db/entities"
import { TwitchUserState } from "@src/client/types"
import { TimeoutsCommand } from "@src/commands/cmd/timeouts"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { getExampleTwitchUserEntity, getExampleTwitchUserState } from "@test-utils/example"
import { setupDatabase } from "@test-utils/setup-db"

describe('test suggest command', () => {
    let messageUser: TwitchUserState
    let timeouts: TimeoutsCommand
    const channel = 'channel'
    beforeAll(async () => {
        await setupDatabase()
    })

    beforeEach(async () => {
        messageUser = getExampleTwitchUserState({})
        timeouts = new TimeoutsCommand()
        await clearDb(hb.db.dataSource)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

    fdescribe('execute', () => {
        it('no param given return no bans because user has no bans', async () => {
            const { response, success } = await timeouts.execute({

                channel: channel,
                message: [],
                user: messageUser
            })

            expect(success).toBeTrue()
            expect(response).toBe('No timeout found')
        })

        it('no params message user has ban in channel', async () => {
            const currentTime = Date.now()
            const times = 1

            await hb.db.ban.save({
                at: currentTime,
                channel: channel,
                user: messageUser.username
            })

            const { response, success } = await timeouts.execute({

                channel: channel,
                message: [],
                user: messageUser
            })
            const expectedResponse = [
                `${messageUser.username} has been timeouted ${times} times in channel ${channel}`,
                `Last ban: ${hb.utils.humanizeNow(currentTime)} ago`]
            expect(success).toBeTrue()
            expect(response).toEqual(expectedResponse)
        })
    })
})

// const expectedResponse = [
    //     `${messageUser.username} has been timeouted ${times}`,
    //     `${channels} different channels`,
    //     `last timeout ${time_ago} ago in ${last_channel}`
    // ]