import { ResourceError, ResourceSuccess } from "@api/types"
import { TwitchUserState } from "@src/client/types"
import { EmoteCommand } from "@src/commands/cmd/emote"
import { getExampleTwitchUserState } from "@test-utils/example"
import { mockEmoteApis } from "@test-utils/mocks"
import { setup } from "@test-utils/setup"

describe('emote command', () => {
    let messageChannel: string
    let user: TwitchUserState
    let emote: EmoteCommand

    beforeAll(() => {
        setup()
    })

    beforeEach(() => {
        messageChannel = 'messageChannel'
        user = getExampleTwitchUserState({})
        emote = new EmoteCommand()
    })

    it('no emotes existing return error for channel', async () => {
        const emotes: string[] = []
        mockEmoteApis(emotes)

        const { success, response } = await emote.execute({
            channel: messageChannel,
            message: [],
            user: user
        })

        expect(response).toBe('No emotes found')
        expect(success).toBeFalse()
    })

    it('no params given return all emotes for channel', async () => {
        const emotes = ['emote1']

        mockEmoteApis(emotes)

        const { success, response } = await emote.execute({
            channel: messageChannel,
            message: [],
            user: user
        })

        const expectedResponse = `FFZ: ${emotes.join(' ')} | BTTV: ${emotes.join(' ')} | 7TV: ${emotes.join(' ')}`

        expect(response).toBe(expectedResponse)
        expect(success).toBeTrue()
    })

    it('no params given ffz cannot be fetched return only seventv and bttv', async () => {
        const emotes = ['emote']
        const successResponse = new ResourceSuccess(emotes)
        const errorResponse = new ResourceError('error')

        spyOn(hb.api.bttv, 'getEmotesForChannel').withArgs(messageChannel).and.resolveTo(successResponse)
        spyOn(hb.api.ffz, 'getEmotesForChannel').withArgs(messageChannel).and.resolveTo(errorResponse)
        spyOn(hb.api.seventv, 'getEmotesForChannel').withArgs(messageChannel).and.resolveTo(successResponse)


        const { success, response } = await emote.execute({
            channel: messageChannel,
            message: [],
            user: user
        })

        expect(success).toBeTrue()
        expect(response).toBe(`BTTV: ${emotes.join(' ')} | 7TV: ${emotes.join(' ')}`)
    })

    it('channel is given return emotes for channel', async () => {
        const emotes = ['emote']
        const channelParam = 'paramChannel'
        const successResponse = new ResourceSuccess(emotes)

        spyOn(hb.api.bttv, 'getEmotesForChannel').withArgs(channelParam).and.resolveTo(successResponse)
        spyOn(hb.api.ffz, 'getEmotesForChannel').withArgs(channelParam).and.resolveTo(successResponse)
        spyOn(hb.api.seventv, 'getEmotesForChannel').withArgs(channelParam).and.resolveTo(successResponse)

        const { success, response } = await emote.execute({
            channel: messageChannel,
            message: [channelParam],
            user: user
        })

        const expectedResponse = `FFZ: ${emotes.join(' ')} | BTTV: ${emotes.join(' ')} | 7TV: ${emotes.join(' ')}`

        expect(success).toBeTrue()
        expect(response).toBe(expectedResponse)
    })
})