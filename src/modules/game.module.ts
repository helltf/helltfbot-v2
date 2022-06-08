import { ChatUserstate } from 'tmi.js'
import { EmoteGameInputResult } from '../games/types'
import { Module } from './export/module'

export class GameModule implements Module {
  name = 'Game'

  initialize() {
    hb.client.on(
      'chat',
      (
        channel: string,
        user: ChatUserstate,
        message: string,
        self: boolean
      ) => {
        if (self) return
        channel = channel.replace('#', '')
        this.input(channel, user, message)
      }
    )
  }

  input(channel: string, user: ChatUserstate, message: string) {
    const game = hb.games.getGame(channel)

    if (!game) return

    const result = game.input(message)

    if (result === EmoteGameInputResult.FINISHED) {
      return hb.sendMessage(
        channel,
        `${user.username} has guessed the emote. The emote was ${game.emote}`
      )
    }

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      return hb.sendMessage(
        channel,
        `${
          user.username
        } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`
      )
    }
  }
}
