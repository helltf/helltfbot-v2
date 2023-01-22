import { DB } from '@src/db/export-repositories'
import { EmoteGameInputResult } from '@src/games/types'
import { GameService } from '@src/services/game.service'
import { ChatUserstate, Client } from 'tmi.js'
import { Module } from './types'

export class GameModule implements Module {
  name = 'Game'
  db: DB
  client: Client
  gameService: GameService

  constructor(db: DB, client: Client, gameService: GameService) {
    this.db = db
    this.client = client
    this.gameService = gameService
  }

  initialize() {
    this.client.on(
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
    const game = this.gameService.getGame(channel)

    if (!game) return

    const result = game.input(message)
    const userId = Number(user['user-id']!)

    if (result === EmoteGameInputResult.FINISHED) {
      this.gameService.removeGameForChannel(game.channel)
      this.client.say(
        channel,
        `${user.username} has guessed the emote. The emote was ${game.actualEmote}`
      )
    }

    if (result === EmoteGameInputResult.LETTER_CORRECT) {
      this.client.say(
        channel,
        `${
          user.username
        } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`
      )
    }

    await this.saveEmotegameEventStats(userId, result)
  }

  async saveEmotegameEventStats(userId: number, result: EmoteGameInputResult) {
    const value = this.gameService.mapResultToValue(result)

    if (!value) return

    await this.saveNotExistingStats(userId)

    await this.incrementStats(userId, value)
  }

  async incrementStats(userId: number, value: string) {
    await this.db.emoteStats.increment(
      {
        user: { id: userId }
      },
      value,
      1
    )
  }

  async saveNotExistingStats(userId: number) {
    const userExists =
      (await this.db.emoteStats.countBy({
        user: {
          id: userId
        }
      })) !== 0

    if (!userExists)
      await this.db.emoteStats.save({
        user: {
          id: userId
        }
      })
  }
}
