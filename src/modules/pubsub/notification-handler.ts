import { Client } from "tmi.js"

export class NotificationHandler {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  sendNotifications(notifications: Map<string, string[]>) {
    for (const [channel, messages] of notifications) {
      messages.forEach(m => this.client.say(channel, m))
    }
  }
}
