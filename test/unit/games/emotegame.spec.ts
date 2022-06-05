import { Emotegame } from "../../../src/games/emotegame.js"

describe('test emotegame class', () => {
  let game: Emotegame
  const channel = 'channel'
  const emote = 'emote'

  beforeEach(() => {
    game = new Emotegame(channel, emote)
  })

  fdescribe('generate underscores', () => {
    it('given emote has length of one return one underscore', () => {
      const emote = 'a'

      const underscores = game.generateUnderscores(emote)

      const expectedResult = ['_']

      expect(underscores).toBe(expectedResult)
    })
  })
  it('', () => {})
})
