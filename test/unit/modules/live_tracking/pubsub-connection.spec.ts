import { PubSubConnection } from "../../../../src/modules/pubsub/pubsub-connection.js"
import { TopicPrefix } from "../../../../src/modules/pubsub/types.js"

describe('test pubsub connection class', () => {
  let connection: PubSubConnection

  beforeEach(() => {
    connection = new PubSubConnection()
  })

  it('connection does not listen to topic return false', () => {
    const topic = { id: 1, prefix: TopicPrefix.STATUS }
    const result = connection.containsTopic(topic)

    expect(result).toBeFalse()
  })

  it('connection contains topic return true', () => {
    const topic = { id: 1, prefix: TopicPrefix.STATUS }
    connection.topics.push(topic)
    const result = connection.containsTopic(topic)

    expect(result).toBeTrue()
  })
})