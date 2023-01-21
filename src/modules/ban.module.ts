import { DB } from "@src/db/export-repositories"
import { Client } from "tmi.js"
import { Module } from "./types"

export class BanTracking implements Module {
  name = 'Ban'
  db: DB
  client: Client

  constructor(db: DB, client: Client) {
    this.db = db
    this.client = client
  }

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
