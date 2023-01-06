import { AddEmoteResponse, AliasResponse, Editor, EmoteData , RemoveEmoteResponse, SevenTvGQL, SevenTvUserResponse } from "src/api/7tv/seventv.gql"
import { ResourceError, ResourceSuccess } from 'src/api/types'

describe('7tv gql', () => {
  let gql: SevenTvGQL

  beforeEach(() => {
    gql = new SevenTvGQL()
  })

  describe.only('get error', () => {
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
      // jest
      //   .spyOn(hb.api.seventv.rest, 'getUserId')
      //   .mockResolvedValue(channelError)

      // const response = await gql.addEmote(emote, channel)

      // expect(response).toBeInstanceOf(ResourceError)
      //
      // const { error } = response as ResourceError

      const error = ''
      expect(error).toBe(channelError.error)
    })

    it('emote could not be found return error resource', async () => {
      const userId = '1'
      const queryError = new ResourceError('emote not found')
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess(userId))
      jest.spyOn(gql, 'queryEmotes').mockResolvedValue(queryError)

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(queryError.error)
    })

    it('add request returns error return error message', async () => {
      const errorCode = '200'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess('1'))
      jest
        .spyOn(gql, 'matchQueriedEmotes')
        .mockResolvedValue(new ResourceSuccess({ id: '1', name: 'emoteName' }))
      jest
        .spyOn(gql, 'runGqlRequest')
        .mockResolvedValue(new ResourceError(errorCode))

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBe(gql.getErrorMessage(errorCode).error)
    })

    it('add request returns success return emotename', async () => {
      const emoteId = '1'
      const emoteName = 'EmoteName'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess('1'))
      jest
        .spyOn(gql, 'matchQueriedEmotes')
        .mockResolvedValue(
          new ResourceSuccess({ id: emoteId, name: emoteName })
        )
      jest.spyOn(gql, 'runGqlRequest').mockResolvedValue(
        new ResourceSuccess<AddEmoteResponse>({
          addChannelEmote: { emotes: [{ id: emoteId, name: emoteName }] }
        })
      )

      const response = await gql.addEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data.name).toBe(emoteName)
    })
  })

  describe('remove emote by id', () => {
    const emoteId = '1'
    const channelId = '1'

    it('request returns error return error resource', async () => {
      const errorResponse = new ResourceError('Error')
      jest.spyOn(gql, 'runGqlRequest').mockResolvedValue(errorResponse)
      const response = await gql.removeEmoteById(emoteId, channelId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error } = response as ResourceError

      expect(error).toBeDefined()
    })

    it('request returns data return emote data', async () => {
      const channelId = '1'
      const emoteData = { id: emoteId, name: 'emote' }
      const emotes = [emoteData]
      jest.spyOn(gql, 'runGqlRequest').mockResolvedValue(
        new ResourceSuccess<RemoveEmoteResponse>({
          removeChannelEmote: { emotes }
        })
      )

      const response = await gql.removeEmoteById(emoteData.id, channelId)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data).toEqual(emoteData)
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

  describe('remove emote', () => {
    const emote = 'emote'
    const channel = 'channel'

    it('user does not exist return error resource', async () => {
      const error = 'Error'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.removeEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toEqual(error)
    })

    it('emote request failes return error resource', async () => {
      const error = 'Emote error'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess('1'))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.removeEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toBe(error)
    })

    it('channel and emote are defined invoke remove by id method', async () => {
      const userId = '1'
      const emoteId = '2'
      const error = 'Error'

      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess(userId))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceSuccess({ id: emoteId, name: emote }))
      jest
        .spyOn(gql, 'removeEmoteById')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.removeEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toBe(error)
      expect(gql.removeEmoteById).toHaveBeenCalledWith(emoteId, userId)
    })

    it('channel and emote are defined invoke remove by id method', async () => {
      const userId = '1'
      const emoteId = '2'

      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess(userId))
      jest
        .spyOn(hb.api.seventv.rest, 'getEmoteIdAndName')
        .mockResolvedValue(new ResourceSuccess({ id: emoteId, name: emote }))
      jest
        .spyOn(gql, 'removeEmoteById')
        .mockResolvedValue(new ResourceSuccess({ id: emoteId, name: emote }))

      const response = await gql.removeEmote(emote, channel)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data).toEqual({ id: emoteId, name: emote })
    })
  })

  describe('set alias', () => {
    const emoteId = '1'
    const emoteName = 'emote'
    const channel = 'channel'

    it('channel does not exist return error', async () => {
      const error = 'Error'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.setAlias(emoteId, emoteName, channel)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toBe(error)
    })

    it('user exists invoke set alias by emote id', async () => {
      const userId = '2'
      jest
        .spyOn(hb.api.seventv.rest, 'getUserId')
        .mockResolvedValue(new ResourceSuccess(userId))
      jest
        .spyOn(gql, 'setAliasByEmoteId')
        .mockResolvedValue(new ResourceSuccess(emoteId))

      const response = await gql.setAlias(emoteId, emoteName, channel)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<string>

      expect(data).toBe(emoteId)
      expect(gql.setAliasByEmoteId).toHaveBeenCalledWith(
        emoteId,
        emoteName,
        userId
      )
    })
  })

  describe('set alias by id', () => {
    const emoteName = 'name'
    const emoteId = '1'
    const channelId = '1'

    it('request returns error return resource error', async () => {
      const errorMessage = 'Error'
      jest
        .spyOn(gql, 'runGqlRequest')
        .mockResolvedValue(new ResourceError(errorMessage))

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
      const emoteId = '1'
      jest.spyOn(gql, 'runGqlRequest').mockResolvedValue(
        new ResourceSuccess<AliasResponse>({
          editChannelEmote: { id: emoteId }
        })
      )

      const response = await gql.setAliasByEmoteId(
        emoteId,
        emoteName,
        channelId
      )

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<string>

      expect(data).toBe(emoteId)
    })
  })

  describe('get user editors by id', () => {
    it('request returns error return resource error', async () => {
      const userId = '1'
      const error = 'error'

      jest
        .spyOn(gql, 'runGqlRequest')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.getUserEditorsByUserId(userId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorMessage } = response as ResourceError

      expect(errorMessage).toBeDefined()
    })

    it('request is successful return success response', async () => {
      const userId = '1'
      const responseData: SevenTvUserResponse = getExampleSevenTvUserResponse()
      jest
        .spyOn(gql, 'runGqlRequest')
        .mockResolvedValue(new ResourceSuccess(responseData))

      const response = await gql.getUserEditorsByUserId(userId)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<Editor[]>

      expect(data).toEqual(responseData.user.editors)
    })
  })

  describe('add emote by id', () => {
    const emoteId = '1'
    const channelId = '2'

    it('request is not successful return error resource', async () => {
      const error = ''
      jest
        .spyOn(gql, 'runGqlRequest')
        .mockResolvedValue(new ResourceError(error))

      const response = await gql.addEmoteById(emoteId, channelId)

      expect(response).toBeInstanceOf(ResourceError)

      const { error: errorResponse } = response as ResourceError

      expect(errorResponse).toBeDefined()
    })

    it('request is successful return added emote name and id from request', async () => {
      const emoteName = 'emote'
      const emotes: EmoteData[] = [
        { id: emoteId, name: emoteName },
        { id: '4', name: 'otherName' }
      ]
      jest.spyOn(gql, 'runGqlRequest').mockResolvedValue(
        new ResourceSuccess<AddEmoteResponse>({
          addChannelEmote: { emotes }
        })
      )

      const response = await gql.addEmoteById(emoteId, channelId)

      expect(response).toBeInstanceOf(ResourceSuccess)

      const { data } = response as ResourceSuccess<EmoteData>

      expect(data.id).toEqual(emoteId)
      expect(data.name).toEqual(emoteName)
    })
  })
})

function getExampleSevenTvUserResponse(): SevenTvUserResponse {
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
      login: 'user',
      emotes: []
    }
  }
}
