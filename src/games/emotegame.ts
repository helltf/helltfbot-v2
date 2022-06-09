import { Emote } from '../commands/cmd/emotegame'
import { ChatGame, EmoteGameInputResult } from './types'

export class Emotegame implements ChatGame {
  channel: string
  lowerEmote: string
  actualEmote: string
  currentLetters: string[]
  EXPIRING_AFTER: number = 1000 * 60 * 10
  guessedLetters: string[] = []

  constructor(channel: string, emote: string) {
    this.channel = channel
    this.actualEmote = emote
    this.lowerEmote = emote.toLowerCase()
    this.currentLetters = this.generateUnderscores(emote)
  }

  generateUnderscores(emote: Emote): string[] {
    return Array(emote.length).fill('_')
  }

  input(input: string): EmoteGameInputResult {
    input = input.toLowerCase()

    let result = this.getInputResult(input)

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      this.updateCurrentLetters(input)
      this.guessedLetters.push(input)
    }

    return result
  }

  updateCurrentLetters(input: string) {
    this.getLetterIndices(input).forEach(
      i => (this.currentLetters[i] = this.actualEmote[i])
    )
  }

  getLetterIndices(input: string): number[] {
    return this.lowerEmote.split('').reduce((acc: number[], v, index) => {
      if (v.toLowerCase() === input) acc.push(index)
      return acc
    }, [])
  }

  getInputResult(input: string): EmoteGameInputResult {
    if (this.isValidInput(input)) return EmoteGameInputResult.NOTHING

    if (this.isCorrectInput(input)) return EmoteGameInputResult.FINISHED

    if (this.isCorrectLetter(input)) return EmoteGameInputResult.LETTER_CORRECT

    return EmoteGameInputResult.NOTHING
  }

  isCorrectLetter(input: string): boolean {
    if (input.length > 1) return false

    return this.lowerEmote.includes(input)
  }

  isValidInput(input: string): boolean {
    return !input || this.guessedLetters.includes(input)
  }

  isCorrectInput(input: string): boolean {
    const correct = input === this.lowerEmote
    const wouldFinish = this.wouldFinishWord(input)

    return correct || wouldFinish
  }
  wouldFinishWord(input: string): boolean {
    return (
      this.currentLetters
        .map(l => {
          return l === '_' ? input : l.toLowerCase()
        })
        .join('') === this.lowerEmote
    )
  }

  getLetterString(): string {
    return this.currentLetters.join(' ')
  }
}

