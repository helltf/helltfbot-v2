import fetch from "node-fetch";
import { Resource, ResourceError, ResourceSuccess } from "../types.js";

export class BttvApi {
  url = 'https://api.betterttv.net/3/cached/users/twitch/'

  async fetchEmotes(channel: string): Promise<Resource<string[]>> {
    const id = await hb.api.twitch.getUserIdByName(channel)
    const error = new ResourceError('Could not fetch bttv emotes')
    if (!id) return error

    try {
      const { sharedEmotes, channelEmotes } = (await (
        await fetch(this.url + id)
      ).json()) as BttvEmoteResponse
      return new ResourceSuccess(
        [...sharedEmotes, ...channelEmotes].map((e) => e.code)
      )
    } catch (e) {
      return error
    }
  }

  async getEmotesForChannel(channel: string) {
    return this.fetchEmotes(channel)
  }
}

interface BttvEmoteResponse {
  id: string
  bots: string[]
  avatar: string
  channelEmotes: BttvChannelEmotesInfo[]
  sharedEmotes: BttvChannelEmotesInfo[]
}

interface BttvChannelEmotesInfo {
  id: string
  code: string
  imageType: string
  userid: string
}