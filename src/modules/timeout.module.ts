import { DB } from '@src/db/export-repositories'
import { Client } from 'tmi.js'
import { Module } from './types'

export class TimeoutTracking implements Module {
  name = 'Timeout'
  db: DB
  client: Client
  constructor(db: DB, client: Client) {
    this.db = db
    this.client = client
  }
  initialize = () => {
    this.client.on(
      'timeout',
      (channel: string, username: string, _, duration: number) => {
        channel = channel.replace('#', '')

        this.db.timeout.save({
          at: Date.now(),
          channel: channel,
          duration: duration,
          user: username
        })
      }
    )
  }
}
