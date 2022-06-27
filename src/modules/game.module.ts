import { timeStamp } from 'console'
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

  async input(channel: string, user: ChatUserstate, message: string) {
    const game = hb.games.getGame(channel)

    if (!game) return

    const result = game.input(message)
    const userId = Number(user['user-id']!)

    if (result === EmoteGameInputResult.FINISHED) {
      hb.games.removeGameForChannel(game.channel)
      hb.sendMessage(
        channel,
        `${user.username} has guessed the emote. The emote was ${game.actualEmote}`
      )
    }

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      hb.sendMessage(
        channel,
        `${user.username
        } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`
      )
    }

    await this.saveEmotegameEventStats(userId, result)
  }

  async saveEmotegameEventStats(userId: number, result: EmoteGameInputResult) {
    const value = hb.games.mapResultToValue(result)

    if (!value)
      return

    await this.saveNotExistingStats(userId)

    await this.incrementStats(userId, value)
  }

  async incrementStats(userId: number, value: string) {
    await hb.db.emoteStatsRepo.increment({
      user: { id: userId }
    }, value, 1)
  }

  async saveNotExistingStats(userId: number) {
    const userExists = (await hb.db.emoteStatsRepo.countBy({
      user: {
        id: userId
      }
    })) !== 0

    if (!userExists)
      await hb.db.emoteStatsRepo.save({
        user: {
          id: userId
        },
      })
  }
}
