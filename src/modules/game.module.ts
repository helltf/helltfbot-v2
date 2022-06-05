import { ChatUserstate } from 'tmi.js'
import { Emotegame } from '../games/emotegame.js'
import { EmoteGameInputResult } from '../games/types.js'
import { Module } from './export/module.js'

export class GameModule implements Module {
  name: string = 'game'

  initialize() {
    hb.client.on('chat', (channel, user, message, self) => {
      if (!self) return

      this.input(channel, user, message)
    })
  }

  input(channel: string, user: ChatUserstate, message: string) {
    const game = hb.games.getGame(channel)

    if (!game) return

    const result = game.input(message)

    if (result === EmoteGameInputResult.FINISHED) {
      return hb.sendMessage(
        `${user.username} has guessed the emote. The emote was ${game.emote}`
      )
    }

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      return hb.sendMessage(`
        ${
          user.username
        } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`)
    }
  }
}
