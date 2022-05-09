import { Headers, HeadersInit } from 'node-fetch'

const getAuthorizationHeader = (): HeadersInit => {
  const headers = new Headers()

  headers.set('Authorization', 'Bearer ' + hb.twitchAT)
  headers.set('Client-Id', process.env.CLIENT_ID)

  return headers
}

export { getAuthorizationHeader }
