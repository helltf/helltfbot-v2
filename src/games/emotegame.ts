import { ChatGame } from './types.js'

export class Emotegame implements ChatGame {
  channel: string
  emote: string
  EXPIRING_AFTER: number = 1000 * 60 * 10

  constructor(channel: string, emote: string) {
    this.channel = channel
    this.emote = emote
  }
}
