import { getUserIdByName } from './user-info.js'
import { generateToken } from './token.js'

export class TwitchApi {
  accessToken: string

  getUserIdByName = getUserIdByName
  generateToken = generateToken

  async init() {
    this.accessToken = await this.generateToken()
    return this
  }
}
