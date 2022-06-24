import { ResourceSuccess } from "@api/types"
import { Emote } from "@src/commands/cmd/emotegame"

export function mockEmoteApis(resolveTo: Emote[] = ['emote']) {
    const result = new ResourceSuccess(resolveTo)

    spyOn(hb.api.bttv, 'getEmotesForChannel').and.resolveTo(result)
    spyOn(hb.api.ffz, 'getEmotesForChannel').and.resolveTo(result)
    spyOn(hb.api.seventv, 'getEmotesForChannel').and.resolveTo(result)
}