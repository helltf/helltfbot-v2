import { UserNotificationType } from '../../../../src/modules/pubsub/types'
import { PubSubEventHandler } from '../../../../src/modules/pubsub/pubsub-event-handler'

describe('test update event handler unit tests', () => {
  let handler: PubSubEventHandler = new PubSubEventHandler()
  let streamer: string
  let value: string
  beforeEach(() => {
    handler = new PubSubEventHandler()
    streamer = 'streamer'
    value = 'example'
  })

  it('get notification message for live event return live message', () => {
    const type = UserNotificationType.LIVE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has gone live`
    expect(result).toBe(expectedMessage)
  })

  it('get notification message for title event return title message', () => {
    const type = UserNotificationType.TITLE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has changed the title to ${value}`

    expect(result).toBe(expectedMessage)
  })

  it('get notification message for game event return game message', () => {
    const type = UserNotificationType.GAME

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has changed the game to ${value}`

    expect(result).toBe(expectedMessage)
  })

  it('get notification message for offline event return offline message', () => {
    const type = UserNotificationType.OFFLINE

    const result = handler.getNotificationMessage(type, streamer, value)

    const expectedMessage = `@${streamer} has gone offline`

    expect(result).toBe(expectedMessage)
  })
})
