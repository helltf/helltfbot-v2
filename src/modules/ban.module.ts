import { Module } from "./types"

export class BanTracking implements Module {
  name = 'Ban'
  initialize = () => {
    hb.client.on('ban', (channel: string, username: string) => {
      channel = channel.replace('#', '')

      hb.db.ban.save({
        at: Date.now(),
        channel: channel,
        user: username
      })
    })
  }
}
