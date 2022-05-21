import { ChatUserstate } from 'tmi.js'
import { GithubApi } from '../api/github/export-github-api.js'
import { TwitchApi } from '../api/twitch/export-api.js'
import { PermissionLevel } from '../utilities/twitch/types.js'

export interface TwitchUserState extends ChatUserstate {
  permission?: PermissionLevel
}
export class ApiService {
  twitch?: TwitchApi
  github?: GithubApi
  initialized = false

  async init() {
    this.initialized = true
    this.github = new GithubApi()
    this.twitch = await TwitchApi.init()
  }
}
