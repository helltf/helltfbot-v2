import { getUserIdByName } from './user-info.js'
import { generateToken } from './token.js'

export class TwitchApi {
  accessToken: string

  getUserIdByName = getUserIdByName
  generateToken = generateToken

  static async init() {
    const apiInstance = new TwitchApi()
    apiInstance.accessToken = await apiInstance.generateToken()
    return apiInstance
  }
}
