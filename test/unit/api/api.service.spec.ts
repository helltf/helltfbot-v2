import { EmoteInfo, Resource, ResourceError, ResourceSuccess } from "@api/types"
import { Emote, EmoteType } from "@src/commands/cmd/emotegame"
import { ApiService } from "@src/services/api.service"
import { setup } from '@test-utils/setup'

describe('api service', () => {
  setup()
  let service: ApiService
  let channel: string
  const emoteTypes: EmoteType[] = Object.values(EmoteType)

  beforeAll(() => {
    setup()
  })

  beforeEach(() => {
    service = new ApiService()
    channel = 'channel'
  })

  it('no emotes found return object with empty arrays', async () => {
    const result = new ResourceError('error')
    mockService(service, result)

    const emoteInfo = await service.fetchAllEmotes(channel)

    expect(emoteInfo).toEqual({ bttv: [], ffz: [], seventv: [] })
  })

  it('all services return emotes return emoteinfo object containing all types', async () => {
    const emotes = ['emote1', 'emote2']
    const result = new ResourceSuccess(emotes)
    mockService(service, result)

    const emoteInfo = await service.fetchAllEmotes(channel)

    const expectedResult: EmoteInfo = {
      bttv: emotes,
      ffz: emotes,
      seventv: emotes
    }

    expect(emoteInfo).toEqual(expectedResult)
  })

  emoteTypes.forEach(type => {
    it(`${type} emote service returns no emotes return empty array for ${type}`, async () => {
      const emotes = ['a', 'b']
      const rest = [...emoteTypes].filter(e => e !== type)
      const successResponse = new ResourceSuccess(emotes)
      const errorResponse = new ResourceError('error')

      jest
        .spyOn(service[type], 'getEmotesForChannel')
        .mockResolvedValue(errorResponse)

      rest.forEach(restType => {
        jest
          .spyOn(service[restType], 'getEmotesForChannel')
          .mockResolvedValue(successResponse)
      })

      const expectedResult: EmoteInfo = {
        bttv: [],
        ffz: [],
        seventv: []
      }

      rest.forEach(restType => {
        expectedResult[restType] = emotes
      })

      const emoteInfo = await service.fetchAllEmotes(channel)
      expect(emoteInfo).toEqual(expectedResult)
    })
  })
})

function mockService(
  service: ApiService,
  resolveTo: Resource<Emote[]> = new ResourceSuccess(['emote'])
) {
  jest.spyOn(service.bttv, 'getEmotesForChannel').mockResolvedValue(resolveTo)
  jest.spyOn(service.ffz, 'getEmotesForChannel').mockResolvedValue(resolveTo)
  jest
    .spyOn(service.seventv, 'getEmotesForChannel')
    .mockResolvedValue(resolveTo)
}