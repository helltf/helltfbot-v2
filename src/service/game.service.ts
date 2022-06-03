import { Emotegame } from '../games/emotegame.js'
import { ChatGame } from '../games/types.js'

export class GameService {
  eg: Emotegame[] = []

  add(game: ChatGame) {
    if (game instanceof Emotegame) {
      return this.addEmoteGame(game)
    }
  }
  addEmoteGame(game: Emotegame): boolean {
    if (this.emoteGameExists(game)) return false

    this.eg.push(game)

    return true
  }

  emoteGameExists(game: Emotegame): boolean {
    return this.eg.some((g) => g.channel === game.channel)
  }
}
