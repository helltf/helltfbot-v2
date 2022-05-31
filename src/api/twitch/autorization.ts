import { Headers, HeadersInit } from 'node-fetch'

const getAuthorizationHeader = (): HeadersInit => {
  const headers = new Headers()

  headers.set('Authorization', 'Bearer ' + hb.api.twitch.accessToken)
  headers.set('Client-Id', hb.config.get('CLIENT_ID')!)

  return headers
}

export { getAuthorizationHeader }
