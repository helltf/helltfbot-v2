import { getUserIdByName } from './user-info.js'
import { generateToken } from './token.js'

export class TwitchApi {
  accessToken: string

  getUserIdByName = getUserIdByName
  generateToken = generateToken

  async init() {
    const generatedToken = await this.generateToken()
    if (!generatedToken) throw new Error("Could not generate Twitch API token")

    this.accessToken = generatedToken
    return this
  }
}
