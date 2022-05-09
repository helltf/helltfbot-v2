export class NotificationHandler {
  constructor() {}

  sendNotifications(notifications: Map<string, string[]>) {
    for (const [channel, messages] of notifications) {
      messages.forEach((m) => hb.sendMessage(channel, m))
    }
  }
}
