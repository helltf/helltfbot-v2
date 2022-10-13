import { EmoteStatsEntity } from "@db/entities"
import { Emotegame } from "@games/emotegame"
import { EmoteGameInputResult } from "@games/types"
import { GameModule } from "@modules/game.module"
import { GameService } from '@src/services/game.service'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import { saveUserStateAsUser } from '@test-utils/save-user'
import { setupDatabase } from '@test-utils/setup-db'
import {
  getExampleEmoteStatsEntity,
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '../../test-utils/example'

describe('test game module', () => {
  let module: GameModule
  let game: Emotegame
  let channel: string

  const results: Array<[EmoteGameInputResult, keyof EmoteStatsEntity]> = [
    [EmoteGameInputResult.FINISHED, 'emotes_guessed'],
    [EmoteGameInputResult.LETTER_CORRECT, 'letters_guessed'],
    [EmoteGameInputResult.INCORRECT, 'incorrect_guesses']
  ]

  beforeEach(async () => {
    hb.games = new GameService()
    channel = 'channel'
    module = new GameModule()
    game = new Emotegame(channel, 'emote')
    hb.games.addEmoteGame(game)
    await clearDb(hb.db.dataSource)
  })

  beforeAll(async () => {
    await setupDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('input function', () => {
    it('game returns finished send finish message', async () => {
      const user = getExampleTwitchUserState({})
      const message = ''

      await saveUserStateAsUser(user)

      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest.spyOn(game, 'input').mockReturnValue(EmoteGameInputResult.FINISHED)

      await module.input(channel, user, message)

      const expectedMesage = `${user.username} has guessed the emote. The emote was ${game.actualEmote}`
      expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
    })

    it('game returns letter correct send letter correct  message', async () => {
      const user = getExampleTwitchUserState({})
      const message = ''

      await saveUserStateAsUser(user)

      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest
        .spyOn(game, 'input')
        .mockReturnValue(EmoteGameInputResult.LETTER_CORRECT)

      await module.input(channel, user, message)

      const expectedMesage = `${
        user.username
      } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`

      expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
    })

    it('game returns finished remove emotegame', async () => {
      const user = getExampleTwitchUserState({})
      const message = ''

      await saveUserStateAsUser(user)

      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())
      jest.spyOn(game, 'input').mockReturnValue(EmoteGameInputResult.FINISHED)

      await module.input(channel, user, message)

      expect(hb.games.eg).toHaveLength(0)
    })
  })

  describe('save functions', () => {
    results.forEach(([result, value]) => {
      it(`user is new save ${EmoteGameInputResult[result]} result to database`, async () => {
        const user = getExampleTwitchUserState({})
        const userId = Number(user['user-id'])

        await saveUserStateAsUser(user)

        await module.saveEmotegameEventStats(userId, result)

        const savedEntity = await hb.db.emoteStats.findOneBy({
          user: {
            id: userId
          }
        })

        expect(savedEntity?.[value]).toBe(1)
      })

      it(`user has already had ${EmoteGameInputResult[result]} result add 1 to counter`, async () => {
        const user = getExampleTwitchUserEntity({})

        const emotegameStats = getExampleEmoteStatsEntity({
          [value]: 1,
          user: user
        })

        await hb.db.user.save(user)

        await hb.db.emoteStats.save(emotegameStats)

        await module.saveEmotegameEventStats(user.id, result)

        const savedEntity = await hb.db.emoteStats.findOneBy({
          user: {
            id: user.id
          }
        })

        expect(savedEntity?.[value]).toBe(2)
      })
    })
  })
})
