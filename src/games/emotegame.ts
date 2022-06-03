import { ChatGame } from './types.js'

export class Emotegame implements ChatGame {
  channel: string

  constructor(channel: string) {
    this.channel = channel
  }
}
