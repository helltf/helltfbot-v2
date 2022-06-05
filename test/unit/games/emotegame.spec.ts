import { Emotegame } from "../../../src/games/emotegame.js"
import { EmoteGameInputResult } from "../../../src/games/types.js"

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
    const expectedArray = Array(game.emote.length).fill('_')
    expect(game.guessedLetters).toEqual(expectedArray)
  })

  fdescribe('input function', () => {
    it('input is empty string return nothing', () => {
      const input = ''
      const state = game.input(input)

      expect(state).toBe(EmoteGameInputResult.NOTHING)
    })

    it('input is longer than 1 return nothing', () => {
      const input = 'abc'

      const state = game.input(input)

      expect(state).toBe(EmoteGameInputResult.NOTHING)
    })

    it('input is exactly the emote return finished', () => {
      const input = game.emote

      const state = game.input(input)

      expect(state).toBe(EmoteGameInputResult.FINISHED)
    })

    it('input letter is part of emote return letter correct', () => {
      const input = 'e'

      const state = game.input(input)

      expect(state).toBe(EmoteGameInputResult.LETTER_CORRECT)
    })

    it('input letter is not part of emote return nothing', () => {
      const input = 'a'

      const state = game.input(input)

      expect(state).toBe(EmoteGameInputResult.NOTHING)
    })
  })
})
