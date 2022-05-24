import { NotificationChannelInfo } from '../../../../src/db/entity/notification_channel.js'
import { PubSub } from '../../../../src/modules/pubsub/pubsub.js'
import { TopicType } from '../../../../src/modules/pubsub/types.js'

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
    const channels = [{ id: 1, name: 'user1', setting: true, status: true }]
    const expectedResult = [
      [{ id: 1, name: 'user1', setting: true, status: true }]
    ]

    const result = module.chunkTopicsIntoSize(channels)

    expect(result).toEqual(expectedResult)
  })

  it('array reduce should return 0 entries', () => {
    const channels = [
      { id: 1, name: 'user1', setting: true, status: true },
      { id: 2, name: 'user2', setting: true, status: true },
      { id: 3, name: 'user3', setting: true, status: true }
    ]
    const expectedLength = 1

    const result = module.chunkTopicsIntoSize(channels)

    expect(result).toHaveSize(expectedLength)
  })

  it('array reduce should return 0 entries', () => {
    const maxArraySize = 1
    const channels = [
      { id: 1, name: 'user1', setting: true, status: true },
      { id: 2, name: 'user2', setting: true, status: true },
      { id: 3, name: 'user3', setting: true, status: true }
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
    const topic = 'video-playback-by-id.31545223'

    const id = module.getIdForTopic(topic)
    const expectedId = '31545223'

    expect(id).toBe(expectedId)
  })

  it('get id for broadcaster setting update topic', () => {
    const topic = 'broadcast-settings-update.1'

    const id = module.getIdForTopic(topic)
    const expectedId = '1'

    expect(id).toBe(expectedId)
  })

  fdescribe('get topics', () => {
    it('array is empty return empty array', () => {
      const channels = []
      const result = module.getTopics(channels)
      const expectedResult = []

      expect(result).toEqual(expectedResult)
    })

    it('array contains 1 channel with status return status topic', () => {
      const exampleChannelInfo = {
        id: 1,
        name: 'name',
        setting: false,
        status: true
      }
      const channels: NotificationChannelInfo[] = [exampleChannelInfo]

      const result = module.getTopics(channels)

      const expectedResult = [TopicType.STATUS + exampleChannelInfo.id]

      expect(result).toEqual(expectedResult)
    })

    it('array contains 1 channel with setting return setting topic', () => {
      const exampleChannelInfo = {
        id: 1,
        name: 'name',
        setting: true,
        status: false
      }
      const channels: NotificationChannelInfo[] = [exampleChannelInfo]

      const result = module.getTopics(channels)

      const expectedResult = [TopicType.SETTING + exampleChannelInfo.id]

      expect(result).toEqual(expectedResult)
    })

    it('array contains 1 channel with setting and status return setting and status topic', () => {
      const exampleChannelInfo = {
        id: 1,
        name: 'name',
        setting: true,
        status: true
      }
      const channels: NotificationChannelInfo[] = [exampleChannelInfo]

      const result = module.getTopics(channels)

      const expectedResult = [
        TopicType.SETTING + exampleChannelInfo.id,
        TopicType.STATUS + exampleChannelInfo.id
      ]

      expect(result).toEqual(expectedResult)
    })
  })
})
