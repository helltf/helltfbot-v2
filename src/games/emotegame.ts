import { Emote } from '../commands/cmd/emotegame.js'
import { ChatGame, EmoteGameInputResult } from './types.js'

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

  input(input: string): EmoteGameInputResult {
    if (input === this.emote) return EmoteGameInputResult.FINISHED
    if (!input || input.length > 1) return EmoteGameInputResult.NOTHING
    if (this.emote.includes(input)) return EmoteGameInputResult.LETTER_CORRECT

    return EmoteGameInputResult.NOTHING
  }
}

