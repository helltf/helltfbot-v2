import { NotificationEntity } from "@db/entities"

export async function saveNotificationWithUser(
  notification: NotificationEntity
) {
  await hb.db.user.save(notification.user)

  await hb.db.notification.save(notification)
}
