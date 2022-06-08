import { Emote } from "../../commands/cmd/emotegame"
import { Resource, ResourceError, ResourceSuccess } from "../types"
import fetch from "node-fetch"

export class SevenTvApi {
  url = 'https://api.7tv.app/v2/users/'

  async fetchEmotes(channel: string): Promise<Resource<Emote[]>> {
    const error = new ResourceError('Error fetching 7tv emotes')

    try {
      const emotes = (await (
        await fetch(this.url + channel + '/emotes')
      ).json()) as SeventvEmoteResponse[]
      return new ResourceSuccess(emotes.map((e) => e.name))
    } catch (e) {
      return error
    }
  }

  async getEmotesForChannel(channel: string): Promise<Resource<Emote[]>> {
    return await this.fetchEmotes(channel)
  }
}

interface SeventvEmoteResponse {
  id: string
  name: string
}
