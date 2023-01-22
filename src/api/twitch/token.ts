import { Resource, ResourceError, ResourceSuccess } from '../types'
import fetch from 'node-fetch'

const tokenUrl = 'https://id.twitch.tv/oauth2/token'

const generateToken = async (): Promise<string | undefined> => {
  const token = await getToken()

  if (token instanceof ResourceSuccess) {
    return token.data
  }

  return undefined
}

const getToken = async (): Promise<Resource<string>> => {
  try {
    const response = await requestApi()
    return new ResourceSuccess(response.access_token)
  } catch (e: any) {
    return new ResourceError(e)
  }
}

const requestApi = async (): Promise<any> => {
  return await (
    await fetch(tokenUrl, {
      method: 'post',
      body: getTokenBody()
    })
  ).json()
}

function getTokenBody() {
  const body = new URLSearchParams()
  body.append('client_id', process.env.CLIENT_ID!)
  body.append('client_secret', process.env.CLIENT_SECRET!)
  body.append('grant_type', 'client_credentials')

  return body
}

export { generateToken, getTokenBody }
