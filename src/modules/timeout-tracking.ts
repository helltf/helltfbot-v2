import { Module } from './export/module.js'

export class TimeoutTracking implements Module {
  name = 'Timeout'
  initialize = () => {
    hb.client.on(
      'timeout',
      (channel: string, username: string, _, duration: number) => {
        channel = channel.replace('#', '')

        hb.db.timeoutRepo.save({
          at: Date.now(),
          channel: channel,
          duration: duration,
          user: username
        })
      }
    )
  }
}
