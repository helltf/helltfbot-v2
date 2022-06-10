import { NotificationEntity } from "@db/entities"

export async function saveNotificationWithUser(
  notification: NotificationEntity
) {
  await hb.db.userRepo.save(notification.user)

  await hb.db.notificationRepo.save(notification)
}
