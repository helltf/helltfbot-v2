import { ResourceSuccess } from "@api/types"
import { Emote } from "@src/commands/cmd/emotegame"
import ReconnectingWebSocket from "reconnecting-websocket"

export function mockEmoteApis(resolveTo: Emote[] = ['emote']) {
  const result = new ResourceSuccess(resolveTo)

  jest.spyOn(hb.api.bttv, 'getEmotesForChannel').mockResolvedValue(result)
  jest.spyOn(hb.api.ffz, 'getEmotesForChannel').mockResolvedValue(result)
  jest.spyOn(hb.api.seventv, 'getEmotesForChannel').mockResolvedValue(result)
}