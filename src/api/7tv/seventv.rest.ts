import fetch from 'node-fetch'
import { Emote } from '../../commands/cmd/emotegame'
import { Resource, ResourceError, ResourceSuccess } from '../types'
import { EmoteData } from './seventv.gql'

export class SevenTvRest {
  url = 'https://api.7tv.app/v2'

  async fetchEmotes(
    channel: string
  ): Promise<Resource<SeventvEmoteResponse[]>> {
    const error = new ResourceError('Error fetching 7tv emotes')

    try {
      const emotes = (await (
        await fetch(`${this.url}/users/${channel}/emotes`)
      ).json()) as SeventvEmoteResponse[]
      return new ResourceSuccess(emotes)
    } catch (e) {
      return error
    }
  }

  async getEmotesForChannel(channel: string): Promise<Resource<Emote[]>> {
    const emotes = await this.fetchEmotes(channel)

    if (emotes instanceof ResourceError) return emotes
    return new ResourceSuccess(emotes.data.map(emote => emote.name))
  }

  async getUserId(username: string) {
    try {
      const user = (await (
        await fetch(`${this.url}/users/${username}`)
      ).json()) as SevenTvUserResponse
      return new ResourceSuccess(user.id)
    } catch (e) {
      return new ResourceError('Error fetching user')
    }
  }

  async getEmoteIdAndName(
    givenEmote: string,
    channel: string
  ): Promise<Resource<EmoteData>> {
    const emotes = await this.fetchEmotes(channel)
    if (emotes instanceof ResourceError)
      return new ResourceError('Could not fetch emotes')

    const emote = emotes.data.find(e => e.name === givenEmote)

    return emote
      ? new ResourceSuccess({ id: emote.id, name: emote.name })
      : new ResourceError('emote not found')
  }

  async getEmoteById(emoteId: string): Promise<Resource<SevenTvEmote>> {
    try {
      const response = await (
        await fetch(`${this.url}/emotes/${emoteId}`)
      ).json()
      return new ResourceSuccess(response as SevenTvEmote)
    } catch (e: any) {
      return new ResourceError('Could not get emote')
    }
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

export interface Role {
  id: string
  name: string
  position: number
  color: number
  allowed: number
  denied: number
}

export interface Owner {
  id: string
  twitch_id: string
  login: string
  display_name: string
  role: Role
}

export interface SevenTvEmote {
  id: string
  name: string
  owner: Owner
  visibility: number
  visibility_simple: any[]
  mime: string
  status: number
  tags: any[]
  width: number[]
  height: number[]
  urls: string[][]
}

