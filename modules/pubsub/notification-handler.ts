export class NotificationHandler {
  constructor() {}

  sendNotifications(notifications: Map<string, string[]>) {
    for (let [channel, messages] of notifications) {
      messages.forEach((m) => hb.sendMessage(channel, m))
    }
  }
}
