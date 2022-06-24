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
        const emotes = ['emote1', 'emote2']

        mockEmoteApis(emotes)

        const { success, response } = await emote.execute({
            channel: messageChannel,
            message: [],
            user: user
        })

        expect(response).toBe('Emotes are ' + emotes.join(' ').repeat(3))
        expect(success).toBeTrue()


    })
})