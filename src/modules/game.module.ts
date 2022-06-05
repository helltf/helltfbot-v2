import { ChatUserstate } from 'tmi.js'
import { Emotegame } from '../games/emotegame.js'
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
  }
}
