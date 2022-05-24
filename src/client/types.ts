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
  constructor() {
    this.github = new GithubApi()
    this.twitch = new TwitchApi()
  }
  async init() {
    this.initialized = true
    await this.twitch.init()
  }
}
