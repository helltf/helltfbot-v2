import { UpdateEventType } from "../../../../modules/pubsub/types.js"
import { UpdateEventHandler } from "../../../../modules/pubsub/update-event-handler.js"

describe('test update event handler unit tests', () => {
    let handler: UpdateEventHandler = new UpdateEventHandler()
    let streamer: string
    let value: string
    beforeEach(()=> {
        handler = new UpdateEventHandler
        streamer = 'streamer'
        value = 'example'
    })

    it('get notification message for undefined event return undefined',()=>{
        let type = undefined

        let message = handler.getNotificationMessage(type, streamer, value)

        expect(message).toBeUndefined()
    })

    it('get notification message for live event return live message', () => {
        let type = UpdateEventType.LIVE

        let result = handler.getNotificationMessage(type, streamer, value)

        let expectedMessage = `@${streamer} has gone live`
        expect(result).toBe(expectedMessage)
    })
})