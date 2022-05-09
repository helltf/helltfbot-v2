import fetch from 'node-fetch'
import { Resource } from '../resource.js'

const tokenUrl = 'https://id.twitch.tv/oauth2/token'

const generateToken = async (): Promise<string | undefined> => {
  let { data, success } = await getToken()

  if (success) {
    return data
  }

  return undefined
}

const getToken = async (): Promise<Resource<string>> => {
  try {
    let response = await requestApi()
    return Resource.ok(response.access_token)
  } catch (e) {
    return Resource.error(e)
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
  body.append('client_id', process.env.CLIENT_ID)
  body.append('client_secret', process.env.CLIENT_SECRET)
  body.append('grant_type', 'client_credentials')

  return body
}

export { generateToken, getTokenBody }
