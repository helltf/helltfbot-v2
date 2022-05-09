import fetch from 'node-fetch'
import { Resource } from '../resource.js'
import { getAuthorizationHeader } from './autorization.js'

const USERS_URL = 'https://api.twitch.tv/helix/users'

const getUserIdByName = async (name: string): Promise<string> => {
  const { data: data, success, error } = await fetchUserAPI(name)

  return data.data[0]?.id
}

const fetchUserAPI = async (
  name: string
): Promise<Resource<TwitchUserInfo>> => {
  try {
    const result: TwitchUserInfo = await (
      await fetch(`${USERS_URL}?login=${name}`, {
        headers: getAuthorizationHeader()
      })
    ).json()
    return Resource.ok(result)
  } catch (e) {
    return Resource.error(e)
  }
}

export interface TwitchUserInfo {
  data?: {
    id?: string
    login?: string
    display_name?: string
    type?: string
    broadcaster_type?: string
    description?: string
    profile_image_url?: string
    offline_image_url?: string
    email?: string
    created_at?: string
  }[]
}

export { getUserIdByName }
