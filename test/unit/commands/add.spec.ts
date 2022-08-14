import { ResourceError, ResourceSuccess } from "@api/types"
import { BotResponse } from "@src/client/types"
import { AddCommand } from "@src/commands/cmd/add"
import { getExampleTwitchUserState } from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('add command', () => {
  let add: AddCommand

  beforeEach(() => {
    setup()
    add = new AddCommand()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('no emote is given return error', async () => {
      const { response, success } = await add.execute({
        channel,
        message: [],
        user: user
      })

      expect(response).toBe('emote as parameter is required')
      expect(success).toBeFalse()
    })

    it('editor request fails return fetch editor error', async () => {
      const error = 'Error'
      const emote = 'emote'
      spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceError(error))

      const { response, success } = await add.execute({
        user,
        channel,
        message: [emote]
      })

      expect(response).toBe('could not fetch editors')
      expect(success).toBeFalse()
    })

    it('user is no editor return error', async () => {
      const emote = 'emote'

      spyOn(hb.api.seventv, 'isEditor').and.resolveTo(
        new ResourceSuccess(false)
      )

      const { response, success } = await add.execute({
        message: [emote],
        channel,
        user
      })

      expect(response).toBe('You are not an editor of this channel :\\')
      expect(success).toBeFalse()
    })

    it('emote is url invoke addEmoteById and return result', async () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const emote = `https://7tv.app/emotes/${id}`
      const returnedResponse: BotResponse = {
        response: 'successful',
        success: true
      }
      spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceSuccess(true))
      spyOn(add.methods, 'addEmoteById').and.resolveTo(returnedResponse)

      const result = await add.execute({
        message: [emote],
        channel,
        user
      })

      expect(result).toEqual(returnedResponse)
      expect(add.methods.addEmoteById).toHaveBeenCalledWith(id, channel)
    })

    it('emote is a name invoke addEmote method', async () => {
      const emote = 'emote'
      const returnedResponse: BotResponse = {
        response: 'successful',
        success: true
      }
      spyOn(hb.api.seventv, 'isEditor').and.resolveTo(new ResourceSuccess(true))
      spyOn(add.methods, 'addEmote').and.resolveTo(returnedResponse)

      const result = await add.execute({ message: [emote], channel, user })

      expect(result).toEqual(returnedResponse)
      expect(add.methods.addEmote).toHaveBeenCalledWith(emote, channel)
    })
  })

  describe('add emote by id', () => {
    const emoteId = '1'
    const channel = 'channel'
    const error = 'Error'

    it('channel is not existing return error', async () => {
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceError(error)
      )

      const { response, success } = await add.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(response).toBe(error)
      expect(success).toBeFalse()
    })

    it('request returns error return fail response', async () => {
      const error = 'Error'
      const userId = '1'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess(userId)
      )
      spyOn(hb.api.seventv.gql, 'addEmoteById').and.resolveTo(
        new ResourceError(error)
      )

      const { response, success } = await add.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(success).toBeFalse()
      expect(response).toBe(error)
    })

    it('request is successful return success response', async () => {
      const userId = '1'
      const emoteName = 'emote'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess(userId)
      )
      spyOn(hb.api.seventv.gql, 'addEmoteById').and.resolveTo(
        new ResourceSuccess({ id: emoteId, name: emoteName })
      )

      const { response, success } = await add.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(success).toBeTrue()
      expect(response).toBe(`Succesfully added ${emoteName}`)
    })
  })

  describe('add emote', () => {
    const emote = 'emote'
    const channel = 'channel'

    it('add emote request fails return error response', async () => {
      const error = 'Error'
      spyOn(hb.api.seventv.gql, 'addEmote').and.resolveTo(
        new ResourceError(error)
      )

      const { response, success } = await add.methods.addEmote(emote, channel)

      expect(response).toBe(error)
      expect(success).toBeFalse()
    })

    it('add emote is successful return success', async () => {
      const emoteData = { id: '1', name: emote }

      spyOn(hb.api.seventv.gql, 'addEmote').and.resolveTo(
        new ResourceSuccess(emoteData)
      )

      const { response, success } = await add.methods.addEmote(emote, channel)

      expect(response).toBe(`Successfully added ${emoteData.name}`)
      expect(success).toBeTrue()
    })
  })
})