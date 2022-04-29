import { PubSub } from "../../../modules/pubsub/pubsub.js"

describe('test chunking function', () => {
	let module: PubSub

	beforeEach(() => {
		module = new PubSub()
	})

	it('array reduce should return 0 entries', () => {
		const channels = []
		const result = module.chunkTopicsIntoSize(channels)
		const expectedSize = 0

		expect(result).toHaveSize(expectedSize)
	})

	it('array reduce should return 0 entries', () => {
		const channels = [{ id: 1, name: 'user1' }]
		const expectedResult = [[{ id: 1, name: 'user1' }]]

		const result = module.chunkTopicsIntoSize(channels)

		expect(result).toEqual(expectedResult)
	})

	it('array reduce should return 0 entries', () => {
		const channels = [
			{ id: 1, name: 'user1' },
			{ id: 2, name: 'user2' },
			{ id: 3, name: 'user3' },
		]
		const expectedLength = 1

		const result = module.chunkTopicsIntoSize(channels)

		expect(result).toHaveSize(expectedLength)
	})

	it('array reduce should return 0 entries', () => {
		let maxArraySize = 1
		const channels = [
			{ id: 1, name: 'user1' },
			{ id: 2, name: 'user2' },
			{ id: 3, name: 'user3' },
		]
		const expectedLength = 3

		const result = module.chunkTopicsIntoSize(channels, maxArraySize)

		expect(result).toHaveSize(expectedLength)
	})
})

describe('test get username from topic', () => {
	let module: PubSub

	beforeEach(() => {
		module = new PubSub()
	})

	it('get id for topic', () => {
		let topic = 'video-playback-by-id.31545223'

		let id = module.getIdForTopic(topic)
		let expectedId = '31545223'

		expect(id).toBe(expectedId)
	})

	it('get id for broadcaster setting update topic', () => {
		let topic = 'broadcast-settings-update.1'

		let id = module.getIdForTopic(topic)
		let expectedId = '1'

		expect(id).toBe(expectedId)
	})
})
