import { SetLevelCommand } from "@src/commands/cmd/setlevel"
import { GlobalPermissionLevel } from "@src/utilities/permission/types"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { getExampleTwitchUserEntity, getExampleTwitchUserState } from "@test-utils/example"
import { setup } from "@test-utils/setup"
import { setupDatabase } from "@test-utils/setup-db"

describe('setlevel command', () => {
    let setlevel: SetLevelCommand
    setup()
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
            const message = ['not existing', 'dev']

            const { response, success } = await setlevel.execute({
                channel,
                message,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('User not found')
        })
    })

    describe('methods', () => {
        const globalPermissions = hb.utils.getEnumValues(GlobalPermissionLevel)
        const user = getExampleTwitchUserEntity({})

        globalPermissions.forEach(perm => {
            it(`update role updates user for ${perm} and return success`, async () => {
                await hb.db.user.save(user)

                const success = await setlevel.methods.updateRole(user.name, perm)

                const updatedEntity = await hb.db.user.findOneBy({
                    name: user.name
                })!

                expect(success).toBeTrue()
                expect(updatedEntity?.permission).toBe(perm)
            })
        })

        it('user does not exist return false', async () => {
            const successs = await setlevel.methods.updateRole('user', GlobalPermissionLevel.ADMIN)

            expect(successs).toBeFalse()
        })
    })
})