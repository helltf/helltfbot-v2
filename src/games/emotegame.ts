import { Emote } from '../commands/cmd/emotegame.js'
import { ChatGame } from './types.js'

export class Emotegame implements ChatGame {
  channel: string
  emote: string
  guessedLetters: string[]
  EXPIRING_AFTER: number = 1000 * 60 * 10

  constructor(channel: string, emote: string) {
    this.channel = channel
    this.emote = emote
    this.guessedLetters = this.generateUnderscores(emote)
  }

  generateUnderscores(emote: Emote): string[] {
    return Array(emote.length).fill('_')
  }
}
