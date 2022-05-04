import { getTokenBody } from '../../../api/twitch/token.js'

describe('test token api ', () => {
	it('body should have a client id', () => {
		let testId = 'abc'
		process.env.CLIENT_ID = testId

		let body = getTokenBody()

		let clientId = body.get('client_id')

		expect(clientId).toBe(testId)
	})

	it('body should have a client secret', () => {
		let testSecret = 'abc'
		process.env.CLIENT_SECRET = testSecret

		let body = getTokenBody()

		let clientSecret = body.get('client_secret')

		expect(clientSecret).toBe(testSecret)
	})

	it('body grant_type should be client_credentials', () => {
		let body = getTokenBody()

		let grantType = body.get('grant_type')
		let expectedGrantType = 'client_credentials'
		expect(grantType).toBe(expectedGrantType)
	})
})
