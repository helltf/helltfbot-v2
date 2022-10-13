import { EmoteData } from "@api/7tv/seventv.gql"
import { ResourceError, ResourceSuccess } from "@api/types"
import { BotResponse } from "@src/client/types"
import { RemoveCommand } from '@src/commands/cmd/remove'
import { getExampleTwitchUserState } from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('remove command', () => {
  let remove: RemoveCommand
  const emote = 'emote'
  const channel = 'channel'

  beforeEach(() => {
    setup()
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
      expect(success).toBe(false)
    })

    it('editor request returns error return error response', async () => {
      const error = 'Error'

      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await remove.execute({
        message: [emote],
        channel,
        user
      })

      expect(response).toBe('could not fetch editors')
      expect(success).toBe(false)
    })

    it('user is not an editor return error', async () => {
      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(false))

      const { response, success } = await remove.execute({
        message: [emote],
        channel,
        user
      })

      expect(response).toBe('You are not an editor of this channel :\\')
      expect(success).toBe(false)
    })

    it('user is editor invoke addEmoteByName with given args and return response', async () => {
      const botResponse: BotResponse = {
        response: 'response',
        success: false
      }

      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))
      jest
        .spyOn(remove.methods, 'addEmoteByName')
        .mockResolvedValue(botResponse)

      const response = await remove.execute({
        message: [emote],
        channel,
        user
      })

      expect(response).toEqual(botResponse)
      expect(remove.methods.addEmoteByName).toHaveBeenCalledWith(emote, channel)
    })

    it('input is url invoke addEmoteById with id and return response', async () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const emoteUrl = `https://7tv.app/emotes/${id}`
      const botResponse: BotResponse = {
        response: 'response',
        success: false
      }
      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))
      jest.spyOn(remove.methods, 'addEmoteById').mockResolvedValue(botResponse)

      const response = await remove.execute({
        message: [emoteUrl],
        channel,
        user
      })

      expect(response).toEqual(botResponse)
      expect(remove.methods.addEmoteById).toHaveBeenCalledWith(id, channel)
    })
  })

  describe('add emote by name', () => {
    it('remove emote request returns error return error response', async () => {
      const error = 'Error'
      jest
        .spyOn(hb.api.seventv.gql, 'removeEmote')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await remove.methods.addEmoteByName(
        emote,
        channel
      )

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('remove emote request is successful return success response', async () => {
      const emoteData = { id: '1', name: emote }

      jest
        .spyOn(hb.api.seventv.gql, 'removeEmote')
        .mockResolvedValue(new ResourceSuccess(emoteData))

      const { response, success } = await remove.methods.addEmoteByName(
        emote,
        channel
      )

      expect(response).toBe(`Successfully removed ${emoteData.name}`)
      expect(success).toBe(true)
    })
  })

  describe('add emote by id', () => {
    const emoteId = '1'

    it('channel does not exist return error response', async () => {
      const error = 'Error'

      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await remove.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('adding emotes failes return error response', async () => {
      const error = 'Error'

      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess('2'))
      jest
        .spyOn(hb.api.seventv.gql, 'removeEmoteById')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await remove.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('adding emote is successful return success response', async () => {
      const emoteData: EmoteData = {
        id: emoteId,
        name: emote
      }
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess('2'))
      jest
        .spyOn(hb.api.seventv.gql, 'removeEmoteById')
        .mockResolvedValue(new ResourceSuccess(emoteData))

      const { response, success } = await remove.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(response).toBe(`Successfully removed ${emoteData.name}`)
      expect(success).toBe(false)
    })
  })
})