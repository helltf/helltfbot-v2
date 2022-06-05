import { Emotegame } from '../games/emotegame.js'
import { ChatGame } from '../games/types.js'

export class GameService {
  eg: Emotegame[] = []

  add(game: ChatGame) {
    if (game instanceof Emotegame) {
      this.removeAfterTime(game)

      return this.addEmoteGame(game)
    }
  }

  addEmoteGame(game: Emotegame): boolean {
    if (this.emoteGameExists(game.channel)) return false

    this.eg.push(game)

    return true
  }

  emoteGameExists(channel: string): boolean {
    return this.eg.some((g) => g.channel === channel)
  }

  removeAfterTime(game: ChatGame) {
    setTimeout(() => {
      this.remove(game)
    }, game.EXPIRING_AFTER)
  }

  removeGameForChannel(channel: string) {
    const index = this.eg.findIndex((g) => channel === g.channel)

    if (index > -1) {
      this.eg.splice(index, 1)
    }
  }

  async remove(game: ChatGame) {
    if (game instanceof Emotegame) {
      const index = this.eg.findIndex((g) => game.channel === g.channel)

      if (index > -1) {
        this.eg.splice(index, 1)
        await hb.sendMessage(
          game.channel,
          `The running emotegame has been cancelled, because the time limit of ${
            game.EXPIRING_AFTER / 1000 / 60
          } minutes is over`
        )
      }
    }
  }
}