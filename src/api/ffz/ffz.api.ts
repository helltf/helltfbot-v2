import { Emote } from "../../commands/cmd/emotegame"
import { EmoteApi, Resource, ResourceError, ResourceSuccess } from "../types"
import fetch from 'node-fetch'

export class FfzApi implements EmoteApi {
  url = 'https://api.frankerfacez.com/v1/room/'
  async fetchEmotes(channel: string): Promise<Resource<Emote[]>> {
    const error = new ResourceError('Error fetching ffz emotes')

    try {
      const { sets } = (await (
        await fetch(this.url + channel)
      ).json()) as FfzEmoteResponse

      return new ResourceSuccess(this.getEmoteNamesFromSets(sets))
    } catch (e) {
      return error
    }
  }

  getEmoteNamesFromSets(sets: FfzEmoteSets): Emote[] {
    return Object.values(sets)[0].emoticons.map(e => e.name)
  }

  async getEmotesForChannel(channel: string): Promise<Resource<Emote[]>> {
    return await this.fetchEmotes(channel)
  }
}

interface FfzEmoteResponse {
  room: FfzRoomInfo
  sets: FfzEmoteSets
}

interface FfzRoomInfo {
  _id: number
  twitch_id: number
  youtube_id: number
  id: string
  is_group: boolean
  display_name: string
  set: number
  moderator_badge: string
  vip_badge: {
    1: string
    2: string
    4: string
  }
  mod_urls: { 1: string; 2: string; 4: string }
  user_badges?: any
  user_badges_ids?: any
  css?: any
}

interface FfzEmoteSets {
  [set: string]: {
    id: number
    _type: number
    icon: any
    title: string
    css: any
    emoticons: FfzEmoteInfo[]
  }
}

interface FfzEmoteInfo {
  id: number
  name: string
  height: number
  width: number
  public: true
  hidden: false
  modifier: false
  offset: any
  margins: any
  css: any
  owner: {
    _id: number
    name: string
    display_name: string
  }
  urls: {
    '1': string
  }
  status: number
  usage_count: number
  created_at: string
  last_updated: string
}