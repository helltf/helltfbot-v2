import { ResourceError, ResourceSuccess } from '@api/types'
import { SetAliasCommand } from '@src/commands/cmd/setalias'
import { getExampleTwitchUserState } from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('alias command', () => {
  let setalias: SetAliasCommand

  beforeEach(() => {
    setup()
    setalias = new SetAliasCommand()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'
    const emote = 'emote'
    const alias = 'alias'

    it('editor request returns error return this as response', async () => {
      const error = 'Error'
      jest
        .spyOn(setalias.methods, 'isEditor')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await setalias.execute({
        params: { emote, alias },
        user,
        channel
      })

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('getting emote data fails return error', async () => {
      const error = 'Error'
      jest
        .spyOn(setalias.methods, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await setalias.execute({
        params: { emote, alias },
        user,
        channel
      })

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('set alias failes return error', async () => {
      const error = 'Error'
      jest
        .spyOn(setalias.methods, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceSuccess({ id: '1', name: emote }))
      jest
        .spyOn(hb.api.seventv.gql, 'setAlias')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await setalias.execute({
        params: { emote, alias },
        user,
        channel
      })

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('set alias is successful return success', async () => {
      const emoteData = { id: '1', name: emote }
      jest
        .spyOn(setalias.methods, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))
      jest
        .spyOn(hb.api.seventv.gql, 'setAlias')
        .mockResolvedValue(new ResourceSuccess(emoteData.id))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceSuccess(emoteData))

      const { response, success } = await setalias.execute({
        params: { emote, alias },
        user,
        channel
      })

      expect(success).toBe(true)
      expect(response).toBe(`Successfully set ${alias} as alias for ${emote}`)
    })
  })

  describe('is editor method', () => {
    const username = 'user'
    const channel = 'channel'

    it('request failes return error', async () => {
      const error = 'Error'
      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceError(error))

      const result = await setalias.methods.isEditor(username, channel)

      expect(result).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = result as ResourceError

      expect(errorMessage).toBe('could not fetch editors')
    })

    it('user is not editor return error message', async () => {
      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(false))

      const result = await setalias.methods.isEditor(username, channel)

      expect(result).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = result as ResourceError

      expect(errorMessage).toBe('You are not an editor of this channel :\\')
    })

    it('user is editor return success with true', async () => {
      jest
        .spyOn(hb.api.seventv, 'isEditor')
        .mockResolvedValue(new ResourceSuccess(true))

      const result = await setalias.methods.isEditor(username, channel)

      expect(result).toBeInstanceOf(ResourceSuccess)

      const { data } = result as ResourceSuccess<boolean>

      expect(data).toBe(true)
    })
  })
})
