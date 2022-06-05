import { Emote } from "../commands/cmd/emotegame.js";
import { SevenTvApi } from "./7tv/Seventv.api.js";
import { BttvApi } from "./bttv/bttv.api.js";
import { FfzApi } from "./ffz/ffz.api.js";
import { GithubApi } from './github/export-github-api.js'
import { TwitchApi } from './twitch/export-api.js'

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
}

export declare interface EmoteApi {
  getEmotesForChannel: (channel: string) => Promise<Resource<Emote[]>>
}