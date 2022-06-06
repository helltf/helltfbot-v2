import { Emote } from '../commands/cmd/emotegame.js'
import { ChatGame, EmoteGameInputResult } from './types.js'

export class Emotegame implements ChatGame {
  channel: string
  emote: string
  currentLetters: string[]
  EXPIRING_AFTER: number = 1000 * 60 * 10
  guessedLetters: string[] = []

  constructor(channel: string, emote: string) {
    this.channel = channel
    this.emote = emote
    this.currentLetters = this.generateUnderscores(emote)
  }

  generateUnderscores(emote: Emote): string[] {
    return Array(emote.length).fill('_')
  }

  input(input: string): EmoteGameInputResult {
    const result = this.getInputResult(input)

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      input = input.toLowerCase()
      this.updateCurrentLetters(input)
      this.guessedLetters.push(input)
    }

    return result
  }

  updateCurrentLetters(input: string) {
    this.emote
      .split('')
      .reduce((acc: number[], v, index) => {
        if (v.toLowerCase() === input) acc.push(index)
        return acc
      }, [])
      .forEach((i) => (this.currentLetters[i] = this.emote[i]))
  }

  getInputResult(input: string): EmoteGameInputResult {
    input = input.toLowerCase()

    if (this.isValidInput(input)) return EmoteGameInputResult.NOTHING

    if (this.isCorrectInput(input)) return EmoteGameInputResult.FINISHED

    if (this.isCorrectLetter(input)) return EmoteGameInputResult.LETTER_CORRECT

    return EmoteGameInputResult.NOTHING
  }

  isCorrectLetter(input: string): boolean {
    if (input.length > 1) return false

    return this.emote.toLowerCase().includes(input)
  }

  isValidInput(input: string): boolean {
    return !input || this.guessedLetters.includes(input)
  }

  isCorrectInput(input: string): boolean {
    return input === this.emote.toLowerCase()
  }

  getLetterString(): string {
    return this.currentLetters.join(' ')
  }
}

