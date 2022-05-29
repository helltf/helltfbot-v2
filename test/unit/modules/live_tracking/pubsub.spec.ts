import { NotificationChannelInfo } from "../../../../src/db/entity/notification_channel.js"
import { PubSubConnection } from "../../../../src/modules/pubsub/pubsub-connection.js"
import { PubSub } from "../../../../src/modules/pubsub/pubsub.js"
import { Topic, TopicPrefix } from "../../../../src/modules/pubsub/types.js"

describe('test chunking function', () => {
  let module: PubSub

  beforeEach(() => {
    module = new PubSub()
  })

  it('array reduce should return 0 entries', () => {
    const channels: NotificationChannelInfo[] = []
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

  describe('get topics', () => {
    it('array is empty return empty array', () => {
      const channels: NotificationChannelInfo[] = []
      const result = module.getTopics(channels)
      const expectedResult: Topic[] = []

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

      const expectedResult = [{ prefix: TopicPrefix.STATUS, id: exampleChannelInfo.id }]

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

      const expectedResult = [{ prefix: TopicPrefix.SETTING, id: exampleChannelInfo.id }]

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
        { prefix: TopicPrefix.SETTING, id: exampleChannelInfo.id },
        { prefix: TopicPrefix.STATUS, id: exampleChannelInfo.id }
      ]

      expect(result).toEqual(expectedResult)
    })

    it('array contains two channels with setting return both topics', () => {
      const exampleChannelInfo1 = {
        id: 1,
        name: 'name',
        setting: true,
        status: true
      }

      const exampleChannelInfo2 = {
        id: 1,
        name: 'name',
        setting: true,
        status: true
      }
      const channels = [exampleChannelInfo1, exampleChannelInfo2]
      const result = module.getTopics(channels)

      const expectedResult = [
        { prefix: TopicPrefix.SETTING, id: exampleChannelInfo1.id },
        { prefix: TopicPrefix.STATUS, id: exampleChannelInfo1.id },
        { prefix: TopicPrefix.SETTING, id: exampleChannelInfo2.id },
        { prefix: TopicPrefix.STATUS, id: exampleChannelInfo2.id }
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('find connection function', () => {
    it('no connection for topic returns no connection', () => {
      const topic = {
        id: 1,
        prefix: TopicPrefix.SETTING

      }
      const connection = module.findConnectionForTopic(topic)

      expect(connection).toBeUndefined()
    })

    it('connection exists with topic return connection', () => {
      const topic = {
        prefix: TopicPrefix.SETTING,
        id: 1
      }
      const connection = new PubSubConnection()

      connection.topics.push(topic)
      module.connections.push(connection)

      const foundConnection = module.findConnectionForTopic(topic)

      expect(foundConnection).toBeDefined()
    })
  })
})
