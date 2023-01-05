
import fetch from 'node-fetch'
import { Resource, ResourceError, ResourceSuccess } from '../types'

export const requestGithubApi = async <T>(path: string): Promise<Resource<T>> => {
  try {
    const result = await fetch(path, {
      method: 'GET',
      headers: {
        Authorization: 'token ' + hb.config.get('GITHUB_TOKEN')
      }
    })
    return new ResourceSuccess((await result.json()) as T)
  } catch (e: any) {
    return new ResourceError(e)
  }
}
