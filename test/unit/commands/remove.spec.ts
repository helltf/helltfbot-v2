import { ResourceError, ResourceSuccess } from "@api/types"
import { BotResponse } from "@src/client/types"
import { RemoveCommand } from "@src/commands/cmd/remove"
import { getExampleTwitchUserState } from "@test-utils/example"

fdescribe('remove command', () => {
    let remove: RemoveCommand

    beforeEach(() => {
        remove = new RemoveCommand()
    })

    describe('execute', () => {
        const channel = 'channel'
        const user = getExampleTwitchUserState({})

        it('emote is undefined return error', async () => {
            const { response, success } = await remove.execute({
                message: [],
                channel,
                user
            })

            expect(response).toBe('emote as parameter is required')
            expect(success).toBeFalse()
        })

        it('editor request returns error return error response', async () => {
            const emote = 'emote'
            const error = 'Error'

            spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceError(error))

            const { response, success } = await remove.execute({
                message: [emote],
                channel,
                user
            })

            expect(response).toBe('could not fetch editors')
            expect(success).toBeFalse()
        })

        it('user is not an editor return error', async () => {
            const emote = 'emote'
            spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceSuccess(false))

            const { response, success } = await remove.execute({
                message: [emote],
                channel,
                user
            })

            expect(response).toBe('You are not an editor of this channel :\\')
            expect(success).toBeFalse()
        })

        it('user is editor invoke addEmoteByName with given args and return response', async () => {
            const emote = 'emote'
            const botResponse: BotResponse = {
                response: 'response',
                success: false
            }
            spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceSuccess(true))
            spyOn(remove.methods, 'addEmoteByName').and.resolveTo(botResponse)

            const response = await remove.execute({
                message: [emote],
                channel,
                user
            })

            expect(response).toEqual(botResponse)
            expect(remove.methods.addEmoteByName).toHaveBeenCalledOnceWith(emote, channel)
        })

        it('input is url invoke addEmoteById with id and return response', async () => {
            const id = '60e0ec549db74f240c4c0c5B'
            const emote = `https://7tv.app/emotes/${id}`
            const botResponse: BotResponse = {
                response: 'response',
                success: false
            }
            spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceSuccess(true))
            spyOn(remove.methods, 'addEmoteById').and.resolveTo(botResponse)

            const response = await remove.execute({
                message: [emote],
                channel,
                user
            })

            expect(response).toEqual(botResponse)
            expect(remove.methods.addEmoteById).toHaveBeenCalledOnceWith(id, channel)
        })
    })

    describe('add emote by name', () => {
        const emote = 'emote'
        const channel = 'channel'

        it('remove emote request returns error return error response', async () => {
            const error = 'Error'
            spyOn(hb.api.seventv.gql, 'removeEmote').and.resolveTo(new ResourceError(error))

            const { response, success } = await remove.methods.addEmoteByName(emote, channel)

            expect(response).toBe(error)
            expect(success).toBeFalse()
        })
    })
})