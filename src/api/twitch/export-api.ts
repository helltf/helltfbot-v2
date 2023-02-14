import { Resource, ResourceError, ResourceSuccess } from '@api/types'
import { generateToken } from './token'
import { TwitchUserInfo } from './types'

const USERS_URL = 'https://api.twitch.tv/helix/users'

export class TwitchApi {
  accessToken: string
  generateToken = generateToken

  async init() {
    const generatedToken = await this.generateToken()
    if (!generatedToken) throw new Error('Could not generate Twitch API token')

    this.accessToken = generatedToken
    return this
  }

  getAuthorizationHeaders() {
    const headers = new Headers()

    headers.set('Authorization', 'Bearer ' + this.accessToken)
    headers.set('Client-Id', process.env.CLIENT_ID)

    return headers
  }

  async getUserIdByName(name: string): Promise<number | undefined> {
    const userInfo = await this.fetchUserAPI(name)
    if (userInfo instanceof ResourceError) return

    const id = Number(userInfo.data?.data[0]?.id)

    return id
  }

  async fetchUserAPI(name: string): Promise<Resource<TwitchUserInfo>> {
    try {
      const result: TwitchUserInfo = (await (
        await fetch(`${USERS_URL}?login=${name}`, {
          headers: this.getAuthorizationHeaders()
        })
      ).json()) as any
      return new ResourceSuccess(result)
    } catch (e: any) {
      return new ResourceError(e)
    }
  }
}
