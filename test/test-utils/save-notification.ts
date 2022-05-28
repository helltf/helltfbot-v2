import { Notification } from "../../src/db/export-entities.js"

export async function saveNotificationWithUser(notification: Notification) {
    await hb.db.userRepo.save(notification.user)

    await hb.db.notificationRepo.save(notification)
}
