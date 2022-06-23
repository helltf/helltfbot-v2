import { PubSubConnection } from "@modules/pubsub/pubsub-connection"
import { PubSub } from '@modules/pubsub/pubsub'
import { Topic, TopicPrefix } from '@modules/pubsub/types'
import { NotificationChannelEntity } from '@db/entities'
import { getExampleNotificationChannelEntity } from '@test-utils/example'

describe('test pubsub', () => {
  let module: PubSub

  beforeEach(() => {
    module = new PubSub()
  })

  describe('test chunking function', () => {
    it('array reduce should return 0 entries', () => {
      const channels: NotificationChannelEntity[] = []
      const result = module.chunkTopicsIntoSize(channels)
      const expectedSize = 0

      expect(result).toHaveSize(expectedSize)
    })

    it('array reduce should return 0 entries', () => {
      const channels = [
        getExampleNotificationChannelEntity({
          id: 1,
          name: 'user1',
          setting: true,
          status: true
        })
      ]
      const expectedResult = [
        [
          getExampleNotificationChannelEntity({
            id: 1,
            name: 'user1',
            setting: true,
            status: true
          })
        ]
      ]

      const result = module.chunkTopicsIntoSize(channels)

      expect(result).toEqual(expectedResult)
    })

    it('array reduce should return 0 entries', () => {
      const channels = [
        getExampleNotificationChannelEntity({
          id: 1,
          name: 'user1',
          setting: true,
          status: true
        }),
        getExampleNotificationChannelEntity({
          id: 2,
          name: 'user2',
          setting: true,
          status: true
        }),
        getExampleNotificationChannelEntity({
          id: 3,
          name: 'user3',
          setting: true,
          status: true
        })
      ]
      const expectedLength = 1

      const result = module.chunkTopicsIntoSize(channels)

      expect(result).toHaveSize(expectedLength)
    })

    it('array reduce should return 0 entries', () => {
      const maxArraySize = 1
      const channels = [
        getExampleNotificationChannelEntity({
          id: 1,
          name: 'user1',
          setting: true,
          status: true
        }),
        getExampleNotificationChannelEntity({
          id: 2,
          name: 'user2',
          setting: true,
          status: true
        }),
        getExampleNotificationChannelEntity({
          id: 3,
          name: 'user3',
          setting: true,
          status: true
        })
      ]
      const expectedLength = 3

      const result = module.chunkTopicsIntoSize(channels, maxArraySize)

      expect(result).toHaveSize(expectedLength)
    })
  })

  describe('test get username from topic', () => {
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
        const channels: NotificationChannelEntity[] = []
        const result = module.getTopics(channels)
        const expectedResult: Topic[] = []

        expect(result).toEqual(expectedResult)
      })

      it('array contains 1 channel with status return status topic', () => {
        const exampleChannelInfo = getExampleNotificationChannelEntity({
          id: 1,
          name: 'name',
          setting: false,
          status: true
        })

        const channels: NotificationChannelEntity[] = [exampleChannelInfo]

        const result = module.getTopics(channels)

        const expectedResult = [
          { prefix: TopicPrefix.STATUS, id: exampleChannelInfo.id }
        ]

        expect(result).toEqual(expectedResult)
      })

      it('array contains 1 channel with setting return setting topic', () => {
        const exampleChannelInfo = getExampleNotificationChannelEntity({
          id: 1,
          name: 'name',
          setting: true,
          status: false
        })
        const channels: NotificationChannelEntity[] = [exampleChannelInfo]

        const result = module.getTopics(channels)

        const expectedResult = [
          { prefix: TopicPrefix.SETTING, id: exampleChannelInfo.id }
        ]

        expect(result).toEqual(expectedResult)
      })

      it('array contains 1 channel with setting and status return setting and status topic', () => {
        const exampleChannelInfo = getExampleNotificationChannelEntity({
          id: 1,
          name: 'name',
          setting: true,
          status: true
        })
        const channels: NotificationChannelEntity[] = [exampleChannelInfo]

        const result = module.getTopics(channels)

        const expectedResult = [
          { prefix: TopicPrefix.SETTING, id: exampleChannelInfo.id },
          { prefix: TopicPrefix.STATUS, id: exampleChannelInfo.id }
        ]

        expect(result).toEqual(expectedResult)
      })

      it('array contains two channels with setting return both topics', () => {
        const exampleChannelInfo1 = getExampleNotificationChannelEntity({
          id: 1,
          name: 'name',
          setting: true,
          status: true
        })

        const exampleChannelInfo2 = getExampleNotificationChannelEntity({
          id: 1,
          name: 'name',
          setting: true,
          status: true
        })
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

    describe('create new connection', () => {
      it('creating new functions return empty PubSubConnection', () => {
        const connection = module.createNewPubSubConnection()

        expect(connection).toBeDefined()
        expect(connection.topics).toHaveSize(0)

        expect(module.connections).toHaveSize(1)

        expect(module.connections).toContain(connection)
      })

      it('create two pubsub connections both should be in the connnections array', () => {
        const con1 = module.createNewPubSubConnection()
        const con2 = module.createNewPubSubConnection()

        expect(module.connections).toContain(con1)
        expect(module.connections).toContain(con2)
      })

      it('get open connection returns already existing Connection', () => {
        const connection = new PubSubConnection()
        spyOn(module, 'createNewPubSubConnection')
        module.connections.push(connection)

        module.getOpenConnection()

        expect(module.createNewPubSubConnection).not.toHaveBeenCalled()
      })
      it('get open connection returns new connection because no available', () => {
        const mockedConnection = new PubSubConnection()
        spyOn(mockedConnection, "start").and.callThrough()

        spyOn(module, 'createNewPubSubConnection').and.returnValue(mockedConnection)

        module.getOpenConnection()

        expect(module.createNewPubSubConnection).toHaveBeenCalled()
      })

      it('existing connection is full return a new connection', () => {
        const connection = new PubSubConnection()

        const mockedConnection = new PubSubConnection()
        spyOn(mockedConnection, "start").and.callThrough()

        const topics: Topic[] = Array(50).fill({
          prefix: TopicPrefix.SETTING,
          id: 1
        })
        connection.topics.push(...topics)

        spyOn(module, 'createNewPubSubConnection').and.returnValue(mockedConnection)

        module.connections.push(connection)

        module.getOpenConnection()

        expect(module.createNewPubSubConnection).toHaveBeenCalled()
      })
    })
  })
})
