import { getTokenBody } from "@api/twitch/token"
import { TwitchBot } from "@client/bot"

describe('test token api ', () => {
  beforeAll(() => {
    globalThis.hb = new TwitchBot()
  })
  it('body should have a client id', () => {
    const testId = 'abc'
    process.env.CLIENT_ID = testId

    const body = getTokenBody()

    const clientId = body.get('client_id')

    expect(clientId).toBe(testId)
  })

  it('body should have a client secret', () => {
    const testSecret = 'abc'
    process.env.CLIENT_SECRET = testSecret

    const body = getTokenBody()

    const clientSecret = body.get('client_secret')

    expect(clientSecret).toBe(testSecret)
  })

  it('body grant_type should be client_credentials', () => {
    const body = getTokenBody()

    const grantType = body.get('grant_type')
    const expectedGrantType = 'client_credentials'
    expect(grantType).toBe(expectedGrantType)
  })
})
