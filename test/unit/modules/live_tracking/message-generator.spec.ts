import { MessageGenerator } from '../../../../modules/pubsub/message-generator.js'

describe('Testing message generator service', () => {
  let service: MessageGenerator

  beforeEach(() => {
    service = new MessageGenerator()
  })

  it('add 1 message to not existing entry should add one to entry', () => {
    const map = new Map()
    const newMessages = ['abc']
    const channel = 'a'

    const result = service.addNewEntryToMap(map, newMessages, channel)

    const expectedResult = new Map()
    expectedResult.set(channel, [...newMessages])

    expect(result).toEqual(expectedResult)
  })

  it('add 1 message to existing entry return 2 messages for channel', () => {
    const map = new Map()
    const channel = 'channelname'
    const existingMessage = 'message1'
    const newMessages = 'message2'

    map.set(channel, [existingMessage])

    const result = service.addNewEntryToMap(map, [newMessages], channel)

    const expectedResult = new Map()
    expectedResult.set(channel, [existingMessage, newMessages])

    expect(result).toEqual(expectedResult)
  })

  it('add 2 messages to non existing entry returns map with 2 messages', () => {
    const map = new Map()
    const newMessages = ['abc', 'bc']
    const channel = 'a'

    const result = service.addNewEntryToMap(map, newMessages, channel)

    const expectedResult = new Map()
    expectedResult.set(channel, [...newMessages])

    expect(result).toEqual(expectedResult)
  })

  it('add 2 messages to existing entry returns map with 2 messages', () => {
    const map = new Map()
    const existingMessages = ['1', '2']
    const newMessages = ['3', '4']
    const channel = 'a'

    map.set(channel, existingMessages)

    const result = service.addNewEntryToMap(map, newMessages, channel)

    const expectedResult = new Map()
    expectedResult.set(channel, ['1', '2', '3', '4'])

    expect(result).toEqual(expectedResult)
  })

  it('add entry other channel existing returns 2 channels with messages', () => {
    const map = new Map()
    const channel1 = 'channel1'
    const channel2 = 'channel2'
    const channel1Messages = ['1', '2']
    const channel2Messages = ['3', '4']

    map.set(channel1, channel1Messages)

    const result = service.addNewEntryToMap(map, channel2Messages, channel2)

    const expectedResult = new Map()
    expectedResult.set(channel1, channel1Messages)
    expectedResult.set(channel2, channel2Messages)

    expect(result).toEqual(expectedResult)
  })

  it('concat to maps result in map with both entries', () => {
    const map1 = new Map()
    const map2 = new Map()
    const channel1 = 'channel1'
    const channel2 = 'channel2'

    map1.set(channel1, ['1', '2'])
    map2.set(channel2, ['3', '4'])

    const result = service.concatMaps(map1, map2)

    const expectedResult = new Map()

    expectedResult.set(channel1, ['1', '2'])
    expectedResult.set(channel2, ['3', '4'])

    expect(result).toEqual(expectedResult)
  })

  it('concat to maps returns 1 entry with both messages', () => {
    const map1 = new Map()
    const map2 = new Map()
    const channel1 = 'channel1'

    map1.set(channel1, ['1', '2'])
    map2.set(channel1, ['3', '4'])

    const result = service.concatMaps(map1, map2)

    const expectedResult = new Map()

    expectedResult.set(channel1, ['1', '2', '3', '4'])

    expect(result).toEqual(expectedResult)
  })
})
