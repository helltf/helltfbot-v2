import { EmoteData, SevenTvGQL } from '@api/7tv/seventv.gql'
import { ResourceError, ResourceSuccess } from '@api/types'
import { setup } from '@test-utils/setup'

fdescribe('7tv gql', () => {
  let gql: SevenTvGQL

  beforeEach(() => {
    gql = new SevenTvGQL()
  })

  describe('get error', () => {
    const codeResponses = [
      ['70403', 'Please add me as an editor of your channel :)'],
      ['704611', 'Emote is already enabled'],
      ['704610', 'Emote is not enabled'],
      ['704612', 'Emote with this name already exists'],
      ['704620', 'No slot available'],
      ['0', 'Unknown Error']
    ]

    codeResponses.forEach(([code, message]) => {
      it(`Error code ${code} returns ${message}`, () => {
        const errorMessage = gql.getErrorMessage(code)

        expect(errorMessage).toEqual(new ResourceError(message))
      })
    })
  })

  describe('add emote', () => {
    const channel = 'channel'
    const emote = 'emote'
    beforeEach(() => {
      setup()
    })

    it('channel does not exist return resource error', async () => {
      const channelError = new ResourceError('Error')
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(channelError)

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(channelError.error)
    })

    it('emote could not be found return error resource', async () => {
      const userId = '1'
      const queryError = new ResourceError('emote not found')
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(new ResourceSuccess(userId))
      spyOn(gql, 'queryEmotes').and.resolveTo(queryError)

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(queryError.error)
    })

    it('add request returns error return error message', async () => {
      const errorCode = '200'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(new ResourceSuccess('1'))
      spyOn(gql, 'queryEmotes').and.resolveTo(new ResourceSuccess({ id: '1', name: 'emoteName' }))
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceError(errorCode))

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(gql.getErrorMessage(errorCode).error)
    })

    it('add request returns success return emotename', async () => {
      const emoteName = 'EmoteName'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(new ResourceSuccess('1'))
      spyOn(gql, 'queryEmotes').and.resolveTo(new ResourceSuccess({ id: '1', name: emoteName }))
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceSuccess(''))

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data.name).toBe(emoteName)
    })
  })
})
