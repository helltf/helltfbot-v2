import { NotifyCommand } from "@commands/cmd/notify"
import { UserNotificationType, NotifyEventType } from "@modules/pubsub/types"

describe('unit test notify command functions', () => {
  let notify: NotifyCommand

  beforeEach(() => {
    notify = new NotifyCommand()
  })

  it('Update event is offline map to status', () => {
    const updateEvent = UserNotificationType.OFFLINE
    const expectedNotifyEvent = NotifyEventType.STATUS

    const result = notify.methods.mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is live map to status', () => {
    const updateEvent = UserNotificationType.LIVE
    const expectedNotifyEvent = NotifyEventType.STATUS

    const result = notify.methods.mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is game map to setting', () => {
    const updateEvent = UserNotificationType.GAME
    const expectedNotifyEvent = NotifyEventType.SETTING

    const result = notify.methods.mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is title map to setting', () => {
    const updateEvent = UserNotificationType.TITLE
    const expectedNotifyEvent = NotifyEventType.SETTING

    const result = notify.methods.mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('events from UserNotificationType are valid', () => {
    const events = ['live', 'offline', 'title', 'game']

    for (const event of events) {
      const isNotValid = notify.methods.eventIsNotValid(event)
      expect(isNotValid).toBe(false)
    }
  })
})
