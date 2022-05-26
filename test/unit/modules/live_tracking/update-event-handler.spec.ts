import { UpdateEventType } from '../../../../src/modules/pubsub/types.js'
import { UpdateEventHandler } from '../../../../src/modules/pubsub/update-event-handler.js'

describe('test update event handler unit tests', () => {
  let handler: UpdateEventHandler = new UpdateEventHandler()
  let streamer: string
  let value: string
  beforeEach(() => {
    handler = new UpdateEventHandler()
    streamer = 'streamer'
    value = 'example'
  })

  it('get notification message for live event return live message', () => {
    const type = UpdateEventType.LIVE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has gone live`
    expect(result).toBe(expectedMessage)
  })

  it('get notification message for title event return title message', () => {
    const type = UpdateEventType.TITLE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has changed the title to ${value}`

    expect(result).toBe(expectedMessage)
  })

  it('get notification message for game event return game message', () => {
    const type = UpdateEventType.GAME

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has changed the game to ${value}`

    expect(result).toBe(expectedMessage)
  })

  it('get notification message for offline event return offline message', () => {
    const type = UpdateEventType.OFFLINE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has gone offline`

    expect(result).toBe(expectedMessage)
  })
})
