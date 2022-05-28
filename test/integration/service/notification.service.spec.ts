import { StreamerEventType } from "../../../src/commands/cmd/notify.js"
import { UpdateEventType } from "../../../src/modules/pubsub/types.js"
import { NotificationService } from "../../../src/service/notification.service.js"
import { clearDb } from "../../test-utils/clear.js"
import { disconnectDatabase } from "../../test-utils/disconnect.js"
import { getExampleNotificationEntity } from "../../test-utils/example.js"
import { saveNotificationWithUser } from "../../test-utils/save-notification.js"
import { setupDatabase } from "../../test-utils/setup-db.js"


fdescribe('test notificatin service', () => {
    let service: NotificationService

    beforeAll(async () => {
        await setupDatabase()
    })

    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
        service = new NotificationService()
        await clearDb(hb.db.dataSource)
    })

    afterAll(async () => {
        await disconnectDatabase()
    })

    it('map setting event return game and title', () => {
        const streamerEvent = StreamerEventType.SETTING

        const updateEventTypes = service.mapEventTypeToUpdateType(streamerEvent)

        expect(updateEventTypes).toContain(UpdateEventType.GAME)
        expect(updateEventTypes).toContain(UpdateEventType.TITLE)
    })

    it('map status event return live and offline', () => {
        const streamerEvent = StreamerEventType.STATUS

        const updateEventTypes = service.mapEventTypeToUpdateType(streamerEvent)

        expect(updateEventTypes).toContain(UpdateEventType.LIVE)
        expect(updateEventTypes).toContain(UpdateEventType.OFFLINE)
    })

    it('no notification existing return false', async () => {
        const streamer = 'exampleStreamer'
        const updateEvents = service.mapEventTypeToUpdateType(StreamerEventType.STATUS)
        const isExisting = await service.isNotificationExisting(streamer, updateEvents)

        expect(isExisting).toBeFalse()
    })

    it('notification exists return true', async () => {
        const updateEvents = service.mapEventTypeToUpdateType(StreamerEventType.STATUS)

        const notification = getExampleNotificationEntity({
            [updateEvents[0]]: true
        })

        await saveNotificationWithUser(notification)

        const isExisting = await service.isNotificationExisting(notification.streamer, updateEvents)

        expect(isExisting).toBeTrue()
    })
    it('clean function sets streamer notification for status to false', async () => {
        const event = StreamerEventType.STATUS
        const id = 1
        spyOn(hb.pubSub, 'unlistenStreamerTopic')

        await hb.db.notificationChannelRepo.save({
            setting: true,
            status: true,
            name: 'exampleStreamer',
            id: 1
        })

        await service.clean(id, event)

        const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
            id: id
        })

        expect(hb.pubSub.unlistenStreamerTopic).toHaveBeenCalledWith(id, event)
        expect(updatedEntity![event]).toBeFalse()
    })

    it('clean function sets streamer notification for setting to false', async () => {
        const event = StreamerEventType.SETTING
        const id = 1
        spyOn(hb.pubSub, 'unlistenStreamerTopic')

        await hb.db.notificationChannelRepo.save({
            setting: true,
            status: true,
            name: 'streamer',
            id: id
        })

        await service.clean(id, event)

        const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
            id: id
        })

        expect(hb.pubSub.unlistenStreamerTopic).toHaveBeenCalledWith(id, event)
        expect(updatedEntity![event]).toBeFalse()
    })
})