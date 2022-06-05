import { Emotegame } from "../../../src/games/emotegame.js"

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
})
