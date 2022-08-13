import { Editor, EmoteData, SevenTvGQL, SevenTvUserResponse } from '@api/7tv/seventv.gql'
import { ResourceError, ResourceSuccess } from '@api/types'
import { setup } from '@test-utils/setup'

fdescribe('7tv gql', () => {
  let gql: SevenTvGQL

  beforeEach(() => {
    gql = new SevenTvGQL()
    setup()
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
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess(userId)
      )
      spyOn(gql, 'queryEmotes').and.resolveTo(queryError)

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(queryError.error)
    })

    it('add request returns error return error message', async () => {
      const errorCode = '200'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess('1')
      )
      spyOn(gql, 'matchQueriedEmotes').and.resolveTo(
        new ResourceSuccess({ id: '1', name: 'emoteName' })
      )
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceError(errorCode))

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(gql.getErrorMessage(errorCode).error)
    })

    it('add request returns success return emotename', async () => {
      const emoteName = 'EmoteName'
      spyOn(hb.api.seventv.rest, 'getUserId').and.resolveTo(
        new ResourceSuccess('1')
      )
      spyOn(gql, 'matchQueriedEmotes').and.resolveTo(
        new ResourceSuccess({ id: '1', name: emoteName })
      )
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceSuccess(''))

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data.name).toBe(emoteName)
    })
  })

  describe('remove emote by id', () => {
    const emote = { id: '1', name: 'name' }
    const channelId = '1'

    it('request returns error return error resource', async () => {
      const errorResponse = new ResourceError('Error')
      spyOn(gql, 'runGqlRequest').and.resolveTo(errorResponse)
      const response = await gql.removeEmoteById(emote, channelId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBeDefined()
    })

    it('request returns data return emote data', async () => {
      const emoteData = { id: '1', name: 'name' }
      const channelId = '1'
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceSuccess(undefined))

      const response = await gql.removeEmoteById(emoteData, channelId)

      expect(response).toBeInstanceOf(ResourceSuccess)
    })

    it('get variables returns object with set variables', () => {
      const emoteId = '1'
      const channelId = '1'
      const reason = ''

      const variables = gql.getEmoteUpdateVariables(emoteId, channelId, reason)

      const expectedVariables = {
        em: emoteId,
        ch: channelId,
        re: reason
      }

      expect(variables).toEqual(expectedVariables)
    })
  })

  describe('set alias by id', () => {
    const emoteName = 'name'
    const emoteId = '1'
    const channelId = '1'

    it('request returns error return resource error', async () => {
      const errorMessage = 'Error'
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceError(errorMessage))

      const response = await gql.setAliasByEmoteId(
        emoteId,
        emoteName,
        channelId
      )

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBeDefined()
    })

    it('request is successful return resource success', async () => {
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceSuccess(null))

      const response = await gql.setAliasByEmoteId(
        emoteId,
        emoteName,
        channelId
      )

      expect(response).toBeInstanceOf(ResourceSuccess)
    })
  })

  describe('get user editors by id', () => {
    it('request returns error return resource error', async () => {
      const userId = '1'
      const error = 'error'

      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceError(error))

      const response = await gql.getUserEditorsByUserId(userId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toBeDefined()
    })

    it('request is successful return success response', async () => {
      const userId = '1'
      const responseData: SevenTvUserResponse = getExampleSevenTvUserResponse()
      spyOn(gql, 'runGqlRequest').and.resolveTo(
        new ResourceSuccess(responseData)
      )

      const response = await gql.getUserEditorsByUserId(userId)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<Editor[]>

      expect(data).toEqual(responseData.user.editors)
    })
  })

  describe('add emote by id', () => {
    const emote = { id: '1', name: 'name' }
    const channelId = '2'

    it('request is not successful return error resource', async () => {
      const error = ''
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceError(error))

      const response = await gql.addEmoteById(emote, channelId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorResponse } = response as ResourceError

      expect(errorResponse).toBeDefined()
    })

    it('request is successful return added emote name and id', async () => {
      spyOn(gql, 'runGqlRequest').and.resolveTo(new ResourceSuccess(undefined))

      const response = await gql.addEmoteById(emote, channelId)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data).toEqual(emote)
    })
  })
})

function getExampleSevenTvUserResponse() {
  return {
    user: {
      id: '1',
      email: 'ab',
      display_name: 'user',
      description: 'abc',
      editor_ids: ['2'],
      editors: [
        {
          display_name: 'name',
          id: '2',
          login: 'login'
        }
      ],
      login: 'user'
    }
  }
}
