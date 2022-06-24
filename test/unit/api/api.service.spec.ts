import { ApiService, EmoteApi, EmoteInfo, Resource, ResourceError, ResourceSuccess } from "@api/types"
import { Emote, EmoteType } from "@src/commands/cmd/emotegame"
import { ChatPermissionLevel } from "@src/utilities/permission/types"
import { setup } from "@test-utils/setup"

fdescribe('api service', () => {
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

    it('one emote service returns no emotes return empty array for that service', () => {

    })
})

function mockService(service: ApiService, resolveTo: Resource<Emote[]> = new ResourceSuccess(['emote'])) {
    spyOn(service.bttv, 'getEmotesForChannel').and.resolveTo(resolveTo)
    spyOn(service.ffz, 'getEmotesForChannel').and.resolveTo(resolveTo)
    spyOn(service.seventv, 'getEmotesForChannel').and.resolveTo(resolveTo)
}