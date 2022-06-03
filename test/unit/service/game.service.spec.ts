import { Emotegame } from "../../../src/games/emotegame.js"
import { GameService } from "../../../src/service/game.service.js"

fdescribe('test game service', () => {
  let service: GameService

  beforeEach(() => {
    service = new GameService()
  })

  it('emotegame should be empty array by default', () => {
    expect(service.eg).toHaveSize(0)
  })

  it('add new emotegame pushes to array', () => {
    const channel = 'channel'
    const game = new Emotegame(channel)

    const success = service.add(game)

    expect(service.eg).toHaveSize(1)
    expect(success).toBeTrue()
  })

  it('add emotegame but already existing return false', () => {
    const channel = 'channel'
    const game = new Emotegame(channel)
    service.eg.push(game)

    const success = service.add(game)
    expect(success).toBeFalse()
    expect(service.eg).toHaveSize(1)
  })

  it('add two different channels return true and have length 2', () => {
    const game1 = new Emotegame('channel1')
    const game2 = new Emotegame('channel2')

    const success1 = service.add(game1)
    expect(success1).toBeTrue()

    const success2 = service.add(game2)
    expect(success2).toBeTrue()
  })
})