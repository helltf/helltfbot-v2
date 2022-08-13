import { ResourceError, ResourceSuccess } from "@api/types"
import { AddCommand } from "@src/commands/cmd/add"
import { setup } from "@test-utils/setup"

fdescribe('add command', () => {
  let add: AddCommand

  beforeEach(() => {
    setup()
    add = new AddCommand()
  })

  describe('get url method', () => {
    it('no url given return undefined', () => {
      const url = 'a'

      const result = add.methods.getIdFromUrl(url)

      expect(result).toBeUndefined()
    })

    it('7tv url link is given return id', () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const url = `https://7tv.app/emotes/${id}`

      const result = add.methods.getIdFromUrl(url)

      expect(result).toBe(id)
    })

    it('7tv link is img url return id', () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const url = `https://7tv.app/emotes/${id}/4x`

      const result = add.methods.getIdFromUrl(url)

      expect(result).toBe(id)
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
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess(userId)
      )
      spyOn(hb.api.seventv.gql, 'addEmoteById').and.resolveTo(
        new ResourceSuccess({ id: '1', name: '' })
      )

      const { response, success } = await add.methods.addEmoteById(
        emoteId,
        channel
      )

      expect(success).toBeTrue()
      expect(response).toBe('Succesfully added the emote')
    })
  })
})