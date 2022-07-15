import { SetLevelCommand } from "@src/commands/cmd/setlevel"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { getExampleTwitchUserState } from "@test-utils/example"
import { setupDatabase } from "@test-utils/setup-db"

fdescribe('setlevel command', () => {
    let setlevel: SetLevelCommand

    beforeAll(async () => {
        await setupDatabase()
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

    beforeEach(async () => {
        await clearDb(hb.db.dataSource)
        setlevel = new SetLevelCommand()
    })

    describe('execute', () => {
        const user = getExampleTwitchUserState({})
        const channel = 'channel'
        it('no user is defined return error', async () => {
            const { response, success } = await setlevel.execute({
                channel,
                message: [],
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('You need to define a user')
        })

        it('user is equal to input return error', async () => {
            const message = [user.username!, 'dev']

            const { response, success } = await setlevel.execute({
                channel,
                message,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('Cannot change your own role')
        })

        it('no level is defined return error', async () => {
            const message = ['user2']

            const { response, success } = await setlevel.execute({
                channel,
                message,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('level is missing or not existing')
        })

        it('level is not valid return error', async () => {
            const message = ['user2', 'not existing']

            const { response, success } = await setlevel.execute({
                channel,
                message,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('level is missing or not existing')

        })


        it('user is not existing return error', async () => {
            const message = ['not existing']

            const { response, success } = await setlevel.execute({
                channel,
                message,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('User does not exist')
        })
    })
})