import { MessageGenerator } from "../../../../modules/live_tracking/message-generator.js"

describe('Testing message generator service', () => {
	let service: MessageGenerator

	beforeEach(() => {
		service = new MessageGenerator()
	})

	it('add 1 message to not existing entry should add one to entry', () => {
		let map = new Map()
		let newMessages = ['abc']
		let channel = 'a'

		let result = service.addNewEntryToMap(map, newMessages, channel)

		let expectedResult = new Map()
		expectedResult.set(channel, [...newMessages])

		expect(result).toEqual(expectedResult)
	})

	it('add 1 message to existing entry return 2 messages for channel', () => {
		let map = new Map()
		let channel = 'channelname'
		let existingMessage = 'message1'
		let newMessages = 'message2'

		map.set(channel, [existingMessage])

		let result = service.addNewEntryToMap(map, [newMessages], channel)

		let expectedResult = new Map()
		expectedResult.set(channel, [existingMessage, newMessages])

		expect(result).toEqual(expectedResult)
	})

	it('add 2 messages to non existing entry returns map with 2 messages', () => {
		let map = new Map()
		let newMessages = ['abc', 'bc']
		let channel = 'a'

		let result = service.addNewEntryToMap(map, newMessages, channel)

		let expectedResult = new Map()
		expectedResult.set(channel, [...newMessages])

		expect(result).toEqual(expectedResult)
	})

	it('add 2 messages to existing entry returns map with 2 messages', () => {
		let map = new Map()
		let existingMessages = ['1', '2']
		let newMessages = ['3', '4']
		let channel = 'a'

		map.set(channel, existingMessages)

		let result = service.addNewEntryToMap(map, newMessages, channel)

		let expectedResult = new Map()
		expectedResult.set(channel, ['1', '2', '3', '4'])

		expect(result).toEqual(expectedResult)
	})

	it('add entry other channel existing returns 2 channels with messages', () => {
		let map = new Map()
		let channel1 = 'channel1'
		let channel2 = 'channel2'
		let channel1Messages = ['1', '2']
		let channel2Messages = ['3', '4']

		map.set(channel1, channel1Messages)

		let result = service.addNewEntryToMap(map, channel2Messages, channel2)

		let expectedResult = new Map()
		expectedResult.set(channel1, channel1Messages)
		expectedResult.set(channel2, channel2Messages)

		expect(result).toEqual(expectedResult)
	})

	it('concat to maps result in map with both entries', () => {
		let map1 = new Map()
		let map2 = new Map()
		let channel1 = 'channel1'
		let channel2 = 'channel2'

		map1.set(channel1, ['1', '2'])
		map2.set(channel2, ['3', '4'])

		let result = service.concatMaps(map1, map2)

		let expectedResult = new Map()

		expectedResult.set(channel1, ['1', '2'])
		expectedResult.set(channel2, ['3', '4'])

		expect(result).toEqual(expectedResult)
	})

	it('concat to maps returns 1 entry with both messages', () => {
		let map1 = new Map()
		let map2 = new Map()
		let channel1 = 'channel1'

		map1.set(channel1, ['1', '2'])
		map2.set(channel1, ['3', '4'])

		let result = service.concatMaps(map1, map2)

		let expectedResult = new Map()

		expectedResult.set(channel1, ['1', '2', '3', '4'])

		expect(result).toEqual(expectedResult)
	})

	it('group two entries by channel', () => {
	})
})


function getNotificationInfoExample(): NotificationInfo {
	return {
		channel:'test',
		game: true,
		live: true,
		title: true,
		offline: true,
		id: 1,
		streamer: 'test',
	}
}
