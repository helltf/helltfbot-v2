import { Resource, ResourceError, ResourceSuccess } from '../types'
import { getAuthorizationHeader } from './autorization'
import { TwitchUserInfo } from './types'
import fetch from 'node-fetch'

const USERS_URL = 'https://api.twitch.tv/helix/users'

const getUserIdByName = async (name: string): Promise<number | undefined> => {
  const userInfo = await fetchUserAPI(name)
  if (userInfo instanceof ResourceError) return

  const id = Number(userInfo.data?.data[0]?.id)

  return id
}

const fetchUserAPI = async (
  name: string
): Promise<Resource<TwitchUserInfo>> => {
  try {
    const result: TwitchUserInfo = (await (
      await fetch(`${USERS_URL}?login=${name}`, {
        headers: getAuthorizationHeader()
      })
    ).json()) as any
    return new ResourceSuccess(result)
  } catch (e: any) {
    return new ResourceError(e)
  }
}

export { getUserIdByName }
