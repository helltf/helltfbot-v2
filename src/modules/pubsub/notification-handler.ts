import { client } from "@src/client/main-client";

export class NotificationHandler {
  sendNotifications(notifications: Map<string, string[]>) {
    for (const [channel, messages] of notifications) {
      messages.forEach(m => client.say(channel, m))
    }
  }
}
