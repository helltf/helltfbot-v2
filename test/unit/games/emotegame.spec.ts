import { Emotegame } from "@games/emotegame"
import { EmoteGameInputResult } from "@games/types"

describe('test emotegame class', () => {
  let game: Emotegame
  const channel = 'channel'
  const emote = 'emote'

  beforeEach(() => {
    game = new Emotegame(channel, emote)
  })

  describe('generate underscores', () => {
    for (let i = 1; i < 10; i++) {
      it(`given emote has length of ${i} return ${i} underscore(s)`, () => {
        const emote = 'a'.repeat(i)

        const underscores = game.generateUnderscores(emote)

        const expectedResult = Array(i).fill('_')

        expect(underscores).toEqual(expectedResult)
      })
    }
  })

  it('guessed letters for emote should have 5 underscores', () => {
    const expectedArray = Array(game.actualEmote.length).fill('_')
    expect(game.currentLetters).toEqual(expectedArray)
  })

  describe('input result function', () => {
    it('input is empty string return nothing', () => {
      const input = ''
      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.NOTHING)
    })

    it('input is longer than 1 return nothing', () => {
      const input = 'abc'

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.NOTHING)
    })

    it('input is exactly the emote return finished', () => {
      const input = game.actualEmote

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.FINISHED)
    })

    it('input letter is part of emote return letter correct', () => {
      const input = 'e'

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.LETTER_CORRECT)
    })

    it('input letter is not part of emote return nothing', () => {
      const input = 'a'

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.INCORRECT)
    })

    it('input contains two letters of correct word return nothing', () => {
      const input = 'em'

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.NOTHING)
    })

    it('input is correct but has already been written', () => {
      const input = 'e'
      game.input(input)

      const result = game.getInputResult(input)

      expect(result).toBe(EmoteGameInputResult.NOTHING)
    })

    it('last missing letter is input return finished', () => {
      const guesses = ['e', 'm', 'o']
      const missingLetter = 't'
      guesses.forEach(i => game.input(i))

      const result = game.getInputResult(missingLetter)

      expect(result).toBe(EmoteGameInputResult.FINISHED)
    })
  })

  describe('input function', () => {
    it("input results in nothing don't change guessed letters", () => {
      const input = 'a'

      const result = game.input(input)

      const expectedResult = game.generateUnderscores(game.actualEmote)

      expect(game.currentLetters).toEqual(expectedResult)
      expect(result).toBe(EmoteGameInputResult.INCORRECT)
    })

    it('input letter is part of emote but uppercase return letter correct', () => {
      const input = 'E'

      const result = game.input(input)

      expect(result).toBe(EmoteGameInputResult.LETTER_CORRECT)
    })

    it('input is correct but not same case return finished', () => {
      const input = 'EMOTE'

      const result = game.input(input)

      expect(result).toBe(EmoteGameInputResult.FINISHED)
    })

    it('input is correct letter updating one locations of that letter', () => {
      const input = 'm'

      game.input(input)

      const expectedResult = game.generateUnderscores(game.actualEmote)
      expectedResult[1] = input
      expect(game.currentLetters).toEqual(expectedResult)
    })

    it('input is correct letter updating all locations of that letter', () => {
      const input = 'e'

      game.input(input)

      const expectedResult = game.generateUnderscores(game.actualEmote)
      expectedResult[0] = input
      expectedResult[4] = input

      expect(game.currentLetters).toEqual(expectedResult)
    })

    it('input is emote return finished', () => {
      const input = 'emote'

      const result = game.input(input)

      expect(result).toBe(EmoteGameInputResult.FINISHED)
    })

    it('input e and m updating current letters for both inputs', () => {
      const input1 = 'e'
      const input2 = 'm'

      game.input(input1)
      game.input(input2)

      const expectedResult = game.generateUnderscores(game.actualEmote)
      expectedResult[0] = input1
      expectedResult[4] = input1
      expectedResult[1] = input2

      expect(game.currentLetters).toEqual(expectedResult)
    })
  })

  describe('letter string', () => {
    it('no letter is guessed return only underscores', () => {
      const result = game.getLetterString()

      const expectedString = Array(emote.length).fill('_').join(' ')

      expect(result).toBe(expectedString)
    })

    it('letter e has been guessed return underscores but e replaced', () => {
      const input = 'e'

      game.input(input)

      const result = game.getLetterString()

      const expectedString = Array(emote.length).fill('_')
      expectedString[0] = input
      expectedString[4] = input

      expect(result).toBe(expectedString.join(' '))
    })

    it('letter e and m has been guessed return underscores with e and m replaced', () => {
      const inputE = 'e'
      const inputM = 'm'
      game.input(inputE)
      game.input(inputM)

      const result = game.getLetterString()

      const expectedString = Array(emote.length).fill('_')
      expectedString[0] = inputE
      expectedString[4] = inputE
      expectedString[1] = inputM

      expect(result).toBe(expectedString.join(' '))
    })

    it('last missing letter is input return finished but other case', () => {
      const customEmote = 'ABC'
      const game = new Emotegame(channel, customEmote)
      const guesses = ['A', 'B']
      const missingLetter = 'C'

      guesses.forEach(i => game.input(i))

      const result = game.input(missingLetter)

      expect(result).toBe(EmoteGameInputResult.FINISHED)
    })
  })

  describe('update letters function', () => {
    it('input us not correct not update anything', () => {
      const input = 'a'

      game.updateCurrentLetters(input)

      expect(game.currentLetters).toEqual(
        game.generateUnderscores(game.actualEmote)
      )
    })

    it('input is correct on one location update this location', () => {
      const input = 'm'

      game.updateCurrentLetters(input)
      const expectedResult = game.generateUnderscores(game.actualEmote)
      expectedResult[1] = input

      expect(game.currentLetters).toEqual(expectedResult)
    })

    it('input is correct on two locations update both locations', () => {
      const inputE = 'e'
      const inputM = 'm'

      game.updateCurrentLetters(inputE)
      game.updateCurrentLetters(inputM)

      const expectedResult = game.generateUnderscores(game.actualEmote)
      expectedResult[1] = inputM
      expectedResult[0] = inputE
      expectedResult[4] = inputE

      expect(game.currentLetters).toEqual(expectedResult)
    })
  })
})
