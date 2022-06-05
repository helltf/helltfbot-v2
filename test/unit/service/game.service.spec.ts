import { Emotegame } from "../../../src/games/emotegame.js"
import { GameService } from "../../../src/service/game.service.js"

describe('test game service', () => {
  let service: GameService
  let emote: string
  beforeEach(() => {
    service = new GameService()
    emote = 'emote'
  })

  it('emotegame should be empty array by default', () => {
    expect(service.eg).toHaveSize(0)
  })

  it('add new emotegame pushes to array', () => {
    const channel = 'channel'
    const game = new Emotegame(channel, emote)

    const success = service.add(game)

    expect(service.eg).toHaveSize(1)
    expect(success).toBeTrue()
  })

  it('add emotegame but already existing return false', () => {
    const channel = 'channel'
    const game = new Emotegame(channel, emote)
    service.eg.push(game)

    const success = service.add(game)
    expect(success).toBeFalse()
    expect(service.eg).toHaveSize(1)
  })

  it('add two different channels return true and have length 2', () => {
    const game1 = new Emotegame('channel1', emote)
    const game2 = new Emotegame('channel2', emote)

    const success1 = service.add(game1)
    expect(success1).toBeTrue()

    const success2 = service.add(game2)
    expect(success2).toBeTrue()
  })

  it('emote game exists returns false because games is empty', () => {
    const game = new Emotegame('channel', emote)
    const result = service.emoteGameExists(game.channel)

    expect(result).toBeFalse()
  })

  it('emote game exists return true', () => {
    const game = new Emotegame('channel', emote)
    service.add(game)

    const result = service.emoteGameExists(game.channel)

    expect(result).toBeTrue()
  })

  it('added emotegame will be removed after expiring time over', () => {
    jasmine.clock().install()
    spyOn(hb, 'sendMessage')

    const game = new Emotegame('channel', emote)
    service.add(game)

    jasmine.clock().tick(game.expiringAfter)
    const gameExisting = service.emoteGameExists(game.channel)

    expect(gameExisting).toBeFalse()
    expect(hb.sendMessage).toHaveBeenCalledWith(
      game.channel,
      `The running emotegame has been cancelled, because the time limit of ${
        game.expiringAfter / 1000 / 60
      } minutes is over`
    )
    jasmine.clock().uninstall()
  })

  it('remove game for channel removes existing game', () => {
    const game = new Emotegame('channel', 'emote')
    service.add(game)

    service.removeGameForChannel(game.channel)

    expect(service.eg).toHaveSize(0)
  })
})