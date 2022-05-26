import fetch from 'node-fetch'
import { Resource } from '../resource.js'
import { getAuthorizationHeader } from './autorization.js'
import { TwitchUserInfo } from './types.js'

const USERS_URL = 'https://api.twitch.tv/helix/users'

const getUserIdByName = async (name: string): Promise<number | undefined> => {
  const { data } = await fetchUserAPI(name)

  const id = Number(data?.data[0]?.id)

  return id
}

const fetchUserAPI = async (
  name: string
): Promise<Resource<TwitchUserInfo>> => {
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
