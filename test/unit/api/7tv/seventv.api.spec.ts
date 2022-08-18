import { SevenTvApi } from '@api/7tv/seventv.api'
import { Editor } from '@api/7tv/seventv.gql'
import { ResourceError, ResourceSuccess } from '@api/types'

describe('7tv api', () => {
  let api: SevenTvApi

  beforeEach(() => {
    api = new SevenTvApi()
  })

  it('creating api with rest and gql are defined', () => {
    expect(api.gql).toBeDefined()
    expect(api.rest).toBeDefined()
  })

  describe('is editor function', () => {
    it('username and channel are the same return true', async () => {
      const user = 'user'
      const channel = user

      const isEditor = await api.isEditor(user, channel)

      expect(isEditor).toBeInstanceOf(ResourceSuccess)

      const { data } = isEditor as ResourceSuccess<boolean>

      expect(data).toBeTrue()
    })

    it('editor request returns error return those error resource', async () => {
      const user = 'user'
      const channel = 'channel'
      const errorResponse = new ResourceError('Error')

      spyOn(api.gql, 'getUserEditors').and.resolveTo(errorResponse)

      const isEditor = await api.isEditor(user, channel)

      expect(isEditor).toEqual(errorResponse)
    })

    it('editor request returns no editors return success resource with false', async () => {
      const user = 'user'
      const channel = 'channel'

      const successResponse = new ResourceSuccess([] as Editor[])
      spyOn(api.gql, 'getUserEditors').and.resolveTo(successResponse)

      const isEditor = await api.isEditor(user, channel)

      expect(isEditor).toBeInstanceOf(ResourceSuccess)

      const { data } = isEditor as ResourceSuccess<boolean>

      expect(data).toBeFalse()
    })

    it('editor is response return success with true', async () => {
      const user = 'user'
      const channel = 'channel'
      const editors: Editor[] = [
        { display_name: 'user', id: '1', login: 'user' }
      ]
      const successResponse = new ResourceSuccess(editors)
      spyOn(api.gql, 'getUserEditors').and.resolveTo(successResponse)

      const isEditor = await api.isEditor(user, channel)

      expect(isEditor).toBeInstanceOf(ResourceSuccess)

      const { data } = isEditor as ResourceSuccess<boolean>

      expect(data).toBeTrue()
    })
  })
  describe('get url method', () => {
    it('no url given return undefined', () => {
      const url = 'a'

      const result = api.getIdFromUrl(url)

      expect(result).toBeUndefined()
    })

    it('7tv url link is given return id', () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const url = `https://7tv.app/emotes/${id}`

      const result = api.getIdFromUrl(url)

      expect(result).toBe(id)
    })

    it('7tv link is img url return id', () => {
      const id = '60e0ec549db74f240c4c0c5B'
      const url = `https://7tv.app/emotes/${id}/4x`

      const result = api.getIdFromUrl(url)

      expect(result).toBe(id)
    })
  })
})
