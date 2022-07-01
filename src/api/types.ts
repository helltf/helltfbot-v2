import { Emote } from "../commands/cmd/emotegame";
import { SevenTvApi } from "./7tv/seventv.api";
import { BttvApi } from "./bttv/bttv.api";
import { FfzApi } from "./ffz/ffz.api";
import { GithubApi } from './github/export-github-api'
import { TwitchApi } from './twitch/export-api'

export type Resource<T> = ResourceError | ResourceSuccess<T>

export class ResourceSuccess<T> {
  data: T
  constructor(data: T) {
    this.data = data
  }
}

export class ResourceError {
  error: string
  constructor(error: string) {
    this.error = error
  }
}

export class ApiService {
  twitch: TwitchApi
  github: GithubApi
  seventv: SevenTvApi
  bttv: BttvApi
  ffz: FfzApi
  initialized = false
  constructor() {
    this.github = new GithubApi()
    this.twitch = new TwitchApi()
    this.seventv = new SevenTvApi()
    this.bttv = new BttvApi()
    this.ffz = new FfzApi()
  }
  async init() {
    this.initialized = true
    await this.twitch.init()
  }

  async fetchAllEmotes(channel: string): Promise<EmoteInfo> {
    const promises = [
      this.ffz.getEmotesForChannel(channel),
      this.bttv.getEmotesForChannel(channel),
      this.seventv.getEmotesForChannel(channel)
    ]

    const [ffz, bttv, seventv] = await Promise.all(promises)

    return {
      ffz: ffz instanceof ResourceSuccess ? ffz.data : [],
      bttv: bttv instanceof ResourceSuccess ? bttv.data : [],
      seventv: seventv instanceof ResourceSuccess ? seventv.data : [],
    }
  }
}

export declare interface EmoteApi {
  getEmotesForChannel: (channel: string) => Promise<Resource<Emote[]>>
}

export interface EmoteInfo {
  bttv: Emote[]
  ffz: Emote[]
  seventv: Emote[]
}