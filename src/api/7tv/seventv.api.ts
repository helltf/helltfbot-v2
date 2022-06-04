import { Resource, ResourceError, ResourceSuccess } from "../types.js"

export class SevenTvApi {
  url = 'https://api.7tv.app/v2/users/'

  async fetchEmotes(channel: string): Promise<Resource<string[]>> {
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

  async getEmotesForChannel(channel: string): Promise<string[]> {
    const emotes = await this.fetchEmotes(channel)

    if (emotes instanceof ResourceError) return []

    return emotes.data
  }
}

interface SeventvEmoteResponse {
  id: string
  name: string
}
