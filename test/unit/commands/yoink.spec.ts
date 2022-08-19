import { SevenTvEmote } from '@api/7tv/seventv.rest'
import { ResourceError, ResourceSuccess } from '@api/types'
import { YoinkCommand } from '@src/commands/cmd/yoink'
import { getExampleTwitchUserState } from '@test-utils/example'
import { setup } from '@test-utils/setup'
import exp from 'constants'

describe('yoink', () => {
  let yoink: YoinkCommand

  beforeEach(() => {
    setup()
    yoink = new YoinkCommand()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const messageChannel = 'channel'
    const emote = 'emote'

    it('emote is undefined return error', async () => {
      const { response, success } = await yoink.execute({
        message: [],
        channel: messageChannel,
        user
      })

      expect(response).toBe('no emote specified')
      expect(success).toBe(false)
    })

    it('yoink returns error return error response', async () => {
      const error = 'Error'

      jest
        .spyOn(hb.api.seventv.gql, 'yoink')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await yoink.execute({
        message: [emote],
        channel: messageChannel,
        user
      })

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('yoink is successful invoke setalias function and returns its response', async () => {
      const aliasResponse = { response: 'response', success: true }
      jest
        .spyOn(hb.api.seventv.gql, 'yoink')
        .mockResolvedValue(new ResourceSuccess({ id: '1', name: emote }))

      jest.spyOn(yoink.methods, 'setAlias').mockResolvedValue(aliasResponse)

      const response = await yoink.execute({
        channel: messageChannel,
        user,
        message: [emote]
      })

      expect(response).toEqual(aliasResponse)
    })
  })

  describe('set alias method', () => {
    const emote = { id: '1', name: 'emote' }
    const channel = 'channel'

    it('fetching emote fails return error', async () => {
      const error = 'error'

      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteById')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await yoink.methods.setAlias(emote, channel)

      expect(response).toBe('could not fetch emote data')
      expect(success).toBe(false)
    })

    it('emote default name is the same as yoink emote name return success', async () => {
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteById')
        .mockResolvedValue(
          new ResourceSuccess(
            getExampleSevenTvEmoteResponse(emote.id, emote.name)
          )
        )
      jest.spyOn(hb.api.seventv.gql, 'setAlias').mockImplementation(jest.fn())

      const { response, success } = await yoink.methods.setAlias(emote, channel)

      expect(response).toBe(`Successfully added ${emote.name} to your channel`)
      expect(success).toBe(true)
      expect(hb.api.seventv.gql.setAlias).not.toHaveBeenCalled()
    })

    it('emote has alias but alias request failes return error', async () => {
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteById')
        .mockResolvedValue(
          new ResourceSuccess(
            getExampleSevenTvEmoteResponse(emote.id, 'differentName')
          )
        )
      jest
        .spyOn(hb.api.seventv.gql, 'setAlias')
        .mockResolvedValue(new ResourceError('error'))

      const { response, success } = await yoink.methods.setAlias(emote, channel)

      expect(response).toBe(
        `Successfully added ${emote.name} but could not set alias`
      )
      expect(success).toBe(true)
    })

    it('emote has alias update alias return true', async () => {
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteById')
        .mockResolvedValue(
          new ResourceSuccess(
            getExampleSevenTvEmoteResponse(emote.id, 'differentName')
          )
        )
      jest
        .spyOn(hb.api.seventv.gql, 'setAlias')
        .mockResolvedValue(new ResourceSuccess(emote.id))

      const { response, success } = await yoink.methods.setAlias(emote, channel)

      expect(response).toBe(`Successfully added ${emote.name} to your channel`)
      expect(success).toBe(true)
    })
  })
})

function getExampleSevenTvEmoteResponse(
  id: string = '1',
  name: string = 'emote'
): SevenTvEmote {
  return {
    height: [1],
    id: id,
    mime: 'mime',
    name: name,
    owner: {
      display_name: 'owner',
      id: '2',
      twitch_id: '535',

      login: 'owner',
      role: {
        allowed: 1,
        color: 1,
        denied: 1,
        id: '2',
        name: 'role',
        position: 1
      }
    },
    status: 1,
    tags: [],
    urls: [],
    visibility: 2,
    visibility_simple: [],
    width: [1]
  }
}