import { PubSubConnection } from "../../../../src/modules/pubsub/pubsub-connection.js"

describe('test pubsub connection class', () => {
    let connection: PubSubConnection

    beforeEach(() => {
        connection = new PubSubConnection()
    })

    it('connection does not listen to topic return false', () => {
        const topic = 'topic'
        const result = connection.containsTopic(topic)

        expect(result).toBeFalse()
    })

    it('connection contains topic return true', () => {
        const topic = 'topic'
        connection.topics.push(topic)
        const result = connection.containsTopic(topic)

        expect(result).toBeTrue()
    })
})