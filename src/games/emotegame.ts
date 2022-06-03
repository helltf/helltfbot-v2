import { ChatGame } from './types.js'

export class Emotegame implements ChatGame {
  channel: string
  emote: string

  constructor(channel: string, emote: string) {
    this.channel = channel
    this.emote = emote
  }
}
