import ReconnectingWebSocket from "reconnecting-websocket"
import { PubSubConnection } from "../../../../src/modules/pubsub/pubsub-connection.js"
import { TopicPrefix } from "../../../../src/modules/pubsub/types.js"
import { createMockedWSConnection } from "../../../test-utils/example.js"

fdescribe('test pubsub connection class', () => {
    let connection: PubSubConnection
    let mockedWS: ReconnectingWebSocket

    beforeEach(() => {
        mockedWS = createMockedWSConnection()

        connection = new PubSubConnection(mockedWS)
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

    it('listener should be appended on creation', () => {
        expect(mockedWS.addEventListener).toHaveBeenCalled()
    })
})

