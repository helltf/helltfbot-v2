import { ModCountCommand } from "@src/commands/cmd/modcount"
import { getExampleTwitchUserState } from "@test-utils/example"
import { setup } from "@test-utils/setup"

describe('mod count', () => {
    let modcount: ModCountCommand
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    beforeEach(() => {
        setup()
        modcount = new ModCountCommand()
    })

    describe('execute', () => {
        it('no channel defined return 1 mod count for current channel', async () => {
            const count = 1
            spyOn(hb.client, 'mods').and.resolveTo(Array(count))

            const { response, success } = await modcount.execute({
                message: [],
                channel,
                user
            })

            expect(success).toBeTrue()
            expect(response).toBe(`@${channel} has ${count} moderator`)
        })

        it('channel is defined return 2 mod count for given channel', async () => {
            const count = 2
            const givenChannel = 'givenChannel'
            spyOn(hb.client, 'mods').withArgs(givenChannel).and.resolveTo(Array(count))

            const { response, success } = await modcount.execute({
                message: [givenChannel],
                channel,
                user
            })

            expect(success).toBeTrue()
            expect(response).toBe(`@${givenChannel} has ${count} moderators`)
        })

        it('channel does not exist return error response', async () => {
            spyOn(hb.client, 'mods').and.rejectWith('error')

            const { response, success } = await modcount.execute({
                message: [],
                channel,
                user
            })

            expect(success).toBeFalse()
            expect(response).toBe('Could not get moderators of that channel')
        })
    })

    describe('get mod count', () => {
        it('request fails return error', async () => {
            spyOn(hb.client, 'mods').and.rejectWith('error')

            await modcount.methods.getModCount(channel)
        })

        it('mod is array is length 0 return 0', async () => {
            const length = 0

            spyOn(hb.client, 'mods').withArgs(channel).and.resolveTo(Array(length))

            const amount = await modcount.methods.getModCount(channel)

            expect(amount).toBe(length)
        })


        it('mod is array is length 1 return 1', async () => {
            const length = 1

            spyOn(hb.client, 'mods').withArgs(channel).and.resolveTo(Array(length))

            const amount = await modcount.methods.getModCount(channel)

            expect(amount).toBe(length)
        })
    })
})