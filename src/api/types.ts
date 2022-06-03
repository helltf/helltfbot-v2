import { GithubApi } from "./github/export-github-api.js";
import { TwitchApi } from "./twitch/export-api.js";

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

