import { ResourceError, ResourceSuccess } from "@api/types"
import { TwitchUserState } from "@src/client/types"
import { EmoteCommand } from "@src/commands/cmd/emote"
import { getExampleTwitchUserState } from '@test-utils/example'
import { mockEmoteApis } from '@test-utils/mocks'
import { setup } from '@test-utils/setup'

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
    expect(success).toBe(false)
  })

  it('no params given return all emotes for channel', async () => {
    const emotes = ['emote1']

    mockEmoteApis(emotes)

    const { success, response } = await emote.execute({
      channel: messageChannel,
      message: [],
      user: user
    })

    const expectedResponse = [
      `FFZ: ${emotes.join(' ')}`,
      `BTTV: ${emotes.join(' ')}`,
      `7TV: ${emotes.join(' ')}`
    ]

    expect(response).toEqual(expectedResponse)
    expect(success).toBe(true)
  })

  it('no params given ffz cannot be fetched return only seventv and bttv', async () => {
    const emotes = ['emote']
    const successResponse = new ResourceSuccess(emotes)
    const errorResponse = new ResourceError('error')

    jest
      .spyOn(hb.api.bttv, 'getEmotesForChannel')
      .mockResolvedValue(successResponse)
    jest
      .spyOn(hb.api.ffz, 'getEmotesForChannel')
      .mockResolvedValue(errorResponse)
    jest
      .spyOn(hb.api.seventv, 'getEmotesForChannel')
      .mockResolvedValue(successResponse)

    const { success, response } = await emote.execute({
      channel: messageChannel,
      message: [],
      user: user
    })

    const expectedResponse = [
      `BTTV: ${emotes.join(' ')}`,
      `7TV: ${emotes.join(' ')}`
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })

  it('channel is given return emotes for channel', async () => {
    const emotes = ['emote']
    const channelParam = 'paramChannel'
    const successResponse = new ResourceSuccess(emotes)

    jest
      .spyOn(hb.api.bttv, 'getEmotesForChannel')
      .mockResolvedValue(successResponse)
    jest
      .spyOn(hb.api.ffz, 'getEmotesForChannel')
      .mockResolvedValue(successResponse)
    jest
      .spyOn(hb.api.seventv, 'getEmotesForChannel')
      .mockResolvedValue(successResponse)

    const { success, response } = await emote.execute({
      channel: messageChannel,
      message: [channelParam],
      user: user
    })

    const expectedResponse = [
      `FFZ: ${emotes.join(' ')}`,
      `BTTV: ${emotes.join(' ')}`,
      `7TV: ${emotes.join(' ')}`
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })
})