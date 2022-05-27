import fetch from 'node-fetch'
import { Resource, ResourceError, ResourceState } from '../resource.js'
import { getAuthorizationHeader } from './autorization.js'
import { TwitchUserInfo } from './types.js'

const USERS_URL = 'https://api.twitch.tv/helix/users'

const getUserIdByName = async (name: string): Promise<number | undefined> => {
  const userInfo = await fetchUserAPI(name)
  if (userInfo instanceof ResourceError) return

  const id = Number(userInfo.data?.data[0]?.id)

  return id
}

const fetchUserAPI = async (
  name: string
): Promise<ResourceState<TwitchUserInfo>> => {
  try {
    const result: TwitchUserInfo = await (
      await fetch(`${USERS_URL}?login=${name}`, {
        headers: getAuthorizationHeader()
      })
    ).json() as any
    return Resource.ok(result)
  } catch (e) {
    return Resource.error(e as any)
  }
}




export { getUserIdByName }
