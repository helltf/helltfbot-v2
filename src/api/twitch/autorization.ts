import { Headers, HeadersInit } from 'node-fetch'

export const getAuthorizationHeader = (): HeadersInit => {
  const headers = new Headers()

  headers.set('Authorization', 'Bearer ' + hb.api.twitch.accessToken)
  headers.set('Client-Id', hb.config.get('CLIENT_ID')!)

  return headers
}


