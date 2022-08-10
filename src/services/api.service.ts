import { SevenTvApi } from "@api/7tv/seventv.api"
import { BttvApi } from "@api/bttv/bttv.api"
import { FfzApi } from "@api/ffz/ffz.api"
import { GithubApi } from "@api/github/export-github-api"
import { TwitchApi } from '@api/twitch/export-api'
import { EmoteInfo, ResourceSuccess } from '@api/types'

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
      seventv: seventv instanceof ResourceSuccess ? seventv.data : []
    }
  }
}
