import { mapEventTypeToNotifyType } from '../../../commands/cmd/notify.js'
import {
  NotifyEventType,
  UpdateEventType
} from '../../../modules/pubsub/types.js'

describe('unit test notify command functions', () => {
  it('Update event is offline map to status', () => {
    const updateEvent = UpdateEventType.OFFLINE
    const expectedNotifyEvent = NotifyEventType.STATUS

    const result = mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is live map to status', () => {
    const updateEvent = UpdateEventType.LIVE
    const expectedNotifyEvent = NotifyEventType.STATUS

    const result = mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is game map to setting', () => {
    const updateEvent = UpdateEventType.GAME
    const expectedNotifyEvent = NotifyEventType.SETTING

    const result = mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })

  it('Update event is title map to setting', () => {
    const updateEvent = UpdateEventType.TITLE
    const expectedNotifyEvent = NotifyEventType.SETTING

    const result = mapEventTypeToNotifyType(updateEvent)

    expect(result).toBe(expectedNotifyEvent)
  })
})
