import { Resource, ResourceError, ResourceSuccess } from "@api/types"
import { Emote } from "@src/commands/cmd/emotegame"
import fetch from "node-fetch"

export class SevenTvRest {
  url = 'https://api.7tv.app/v2/users/'

  async fetchEmotes(channel: string): Promise<Resource<Emote[]>> {
    const emotes = await this.fetchEmotesWithData(channel)

    if (emotes instanceof ResourceError) return emotes
    return new ResourceSuccess(emotes.data.map(emote => emote.name))
  }

  async fetchEmotesWithData(
    channel: string
  ): Promise<Resource<SeventvEmoteResponse[]>> {
    const error = new ResourceError('Error fetching 7tv emotes')

    try {
      const emotes = (await (
        await fetch(this.url + channel + '/emotes')
      ).json()) as SeventvEmoteResponse[]
      return new ResourceSuccess(emotes)
    } catch (e) {
      return error
    }
  }

  async getEmotesForChannel(channel: string): Promise<Resource<Emote[]>> {
    return await this.fetchEmotes(channel)
  }

  async getUserId(username: string) {
    try {
      const user = (await (
        await fetch(this.url + username)
      ).json()) as SevenTvUserResponse
      return new ResourceSuccess(user.id)
    } catch (e) {
      return new ResourceError('Error fetching user')
    }
  }

  async getEmoteIdAndName(
    givenEmote: string,
    channel: string
  ): Promise<Resource<string[]>> {
    const emotes = await this.fetchEmotesWithData(channel)
    if (emotes instanceof ResourceError)
      return new ResourceError('Could not fetch emotes')

    const emote = emotes.data.find(e => e.name === givenEmote)

    return !emote
      ? new ResourceError('emote not found')
      : new ResourceSuccess([emote.id, emote.name])
  }
}

interface SeventvEmoteResponse {
  id: string
  name: string
}

interface SevenTvUserResponse {
  id: string
  twitch_id: string
  login: string
  display_name: string
  role: {
    id: string
    name: string
    position: number
    color: number
    allowed: number
    denied: number
  }
  profile_picture_id: string
}