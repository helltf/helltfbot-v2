import { Emotegame } from "@games/emotegame"
import { GameService } from "@src/services/game.service"
import { EmoteGameInputResult } from "@src/games/types"
import { TwitchBot } from "bot"

describe('test game service', () => {
  let service: GameService
  let emote: string
  jest.useFakeTimers()

  beforeEach(() => {
    service = new GameService()
    emote = 'emote'
  })

  it('emotegame should be empty array by default', () => {
    expect(service.eg).toHaveLength(0)
  })

  it('add new emotegame pushes to array', () => {
    const channel = 'channel'
    const game = new Emotegame(channel, emote)

    const success = service.add(game)

    expect(service.eg).toHaveLength(1)
    expect(success).toBe(true)
  })

  it('add emotegame but already existing return false', () => {
    const channel = 'channel'
    const game = new Emotegame(channel, emote)
    service.eg.push(game)

    const success = service.add(game)
    expect(success).toBe(false)
    expect(service.eg).toHaveLength(1)
  })

  it('add two different channels return true and have length 2', () => {
    const game1 = new Emotegame('channel1', emote)
    const game2 = new Emotegame('channel2', emote)

    const success1 = service.add(game1)
    expect(success1).toBe(true)

    const success2 = service.add(game2)
    expect(success2).toBe(true)
  })

  it('emote game exists returns false because games is empty', () => {
    const game = new Emotegame('channel', emote)
    const result = service.emoteGameExists(game.channel)

    expect(result).toBe(false)
  })

  it('emote game exists return true', () => {
    const game = new Emotegame('channel', emote)
    service.add(game)

    const result = service.emoteGameExists(game.channel)

    expect(result).toBe(true)
  })

  it('added emotegame will be removed after expiring time over', () => {
    jest.useFakeTimers()
    jest
      .spyOn(hb, 'sendMessage')
      .mockImplementation(jest.fn())
      .mockImplementation(jest.fn())

    const game = new Emotegame('channel', emote)
    service.add(game)

    jest.advanceTimersByTime(game.EXPIRING_AFTER)
    const gameExisting = service.emoteGameExists(game.channel)

    expect(gameExisting).toBe(false)
    expect(hb.sendMessage).toHaveBeenCalledWith(
      game.channel,
      `The running emotegame has been cancelled, because the time limit of ${
        game.EXPIRING_AFTER / 1000 / 60
      } minutes is over`
    )
  })

  it('remove game for channel removes existing game', () => {
    const game = new Emotegame('channel', 'emote')
    service.add(game)

    service.removeGameForChannel(game.channel)

    expect(service.eg).toHaveLength(0)
  })

  describe('get game function', () => {
    it('game is not existing return undefined', () => {
      const channel = 'channel'

      const game = service.getGame(channel)

      expect(game).toBeUndefined()
    })
    it('other game is existing return undefined', () => {
      const channel = 'channel'
      const addedGame = new Emotegame(channel, 'emote')
      service.addEmoteGame(addedGame)

      const game = service.getGame('otherChannel')

      expect(game).toBeUndefined()
    })

    it('game is existing return game', () => {
      const channel = 'channel'
      const addedGame = new Emotegame(channel, 'emote')
      service.addEmoteGame(addedGame)

      const game = service.getGame(channel)

      expect(game).toEqual(addedGame)
    })
  })

  describe('map function', () => {
    const results: Array<[EmoteGameInputResult, string | undefined]> = [
      [EmoteGameInputResult.FINISHED, 'emotes_guessed'],
      [EmoteGameInputResult.LETTER_CORRECT, 'letters_guessed'],
      [EmoteGameInputResult.INCORRECT, 'incorrect_guesses'],
      [EmoteGameInputResult.NOTHING, undefined]
    ]

    results.forEach(([result, expectedString]) => {
      it(`${EmoteGameInputResult[result]} result returns ${expectedString}`, () => {
        const key = service.mapResultToValue(result)

        expect(key as string | undefined).toBe(expectedString)
      })
    })
  })
})
