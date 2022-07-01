import { ResourceSuccess } from "@api/types"
import { Emote } from "@src/commands/cmd/emotegame"
import ReconnectingWebSocket from "reconnecting-websocket"

export function mockEmoteApis(resolveTo: Emote[] = ['emote']) {
    const result = new ResourceSuccess(resolveTo)

    spyOn(hb.api.bttv, 'getEmotesForChannel').and.resolveTo(result)
    spyOn(hb.api.ffz, 'getEmotesForChannel').and.resolveTo(result)
    spyOn(hb.api.seventv, 'getEmotesForChannel').and.resolveTo(result)
}

export const createMockedWSConnection = (): ReconnectingWebSocket => {
    return jasmine.createSpyObj({
        addEventListener: () => {
            return {}
        },
        send: () => {
            return {}
        },
        reconnect: () => {
            return {}
        }
    })
}
