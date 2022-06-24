import ReconnectingWebSocket from 'reconnecting-websocket'
import { TwitchBot } from '@client/bot'
import { PubSubConnection } from '@modules/pubsub/pubsub-connection'
import { Topic, TopicPrefix } from '@modules/pubsub/types'
import { createMockedWSConnection } from '../../../test-utils/example'

describe('test pubsub connection class', () => {
  let connection: PubSubConnection
  let mockedWS: ReconnectingWebSocket

  beforeEach(() => {
    mockedWS = createMockedWSConnection()

    connection = new PubSubConnection(mockedWS)
  })

  it('connection does not listen to topic return false', () => {
    const topic = {
      id: 1,
      prefix: TopicPrefix.STATUS
    }
    const result = connection.containsTopic(topic)

    expect(result).toBeFalse()
  })

  it('connection contains topic return true', () => {
    const topic = {
      id: 1,
      prefix: TopicPrefix.STATUS
    }
    connection.topics.push(topic)
    const result = connection.containsTopic(topic)

    expect(result).toBeTrue()
  })

  it('listener should be appended on creation', () => {
    expect(mockedWS.addEventListener).toHaveBeenCalled()
  })

  it('set ping interval sends a ping at least in a 5 minute period', () => {
    jasmine.clock().install()

    connection.setPingInterval()

    jasmine.clock().tick(1000 * 60 * 5)

    expect(connection.connection.send).toHaveBeenCalled()

    jasmine.clock().uninstall()
  })

  describe('remove topic', () => {
    it('no topics existing do nothing', () => {
      connection.topics = []

      connection.removeTopics([])

      expect(connection.topics).toEqual([])
    })

    it('one topic existing but no removed stays the same', () => {
      const topics: Topic[] = [
        {
          id: 1,
          prefix: TopicPrefix.SETTING
        }
      ]
      connection.topics = topics

      connection.removeTopics([])

      expect(connection.topics).toEqual(topics)
    })

    it('one topics existing and gets removed', () => {
      const topic = {
        id: 1,
        prefix: TopicPrefix.SETTING
      }
      const topics = [topic]

      connection.topics = topics

      connection.removeTopics([topic])

      expect(connection.topics).toHaveSize(0)
    })

    it('two topics existing and removing one', () => {
      const topic1 = {
        id: 1,
        prefix: TopicPrefix.SETTING
      }
      const topic2 = {
        id: 2,
        prefix: TopicPrefix.SETTING
      }
      const topics = [topic1, topic2]
      connection.topics = topics

      connection.removeTopics([topic1])

      expect(connection.topics).toEqual([topic2])
    })

    it('two topics for the same id only one gets removed', () => {
      const topic1 = {
        id: 1,
        prefix: TopicPrefix.SETTING
      }
      const topic2 = {
        id: 2,
        prefix: TopicPrefix.STATUS
      }
      const topics = [topic1, topic2]
      connection.topics = topics

      connection.removeTopics([topic1])

      expect(connection.topics).toEqual([topic2])
    })
  })

  it('unlisten command should send unlisten to pubsub', () => {
    globalThis.hb = new TwitchBot()
    const topic = {
      id: 1,
      prefix: TopicPrefix.SETTING
    }
    const topics = [topic]
    connection.topics = topics
    spyOn(connection, 'sendMessage')
    spyOn(connection, 'removeTopics')
    connection.unlisten(topics)

    expect(connection.sendMessage).toHaveBeenCalled()
    expect(connection.removeTopics).toHaveBeenCalledWith(topics)
  })
})
