import { Emotegame } from "@games/emotegame"
import { EmoteGameInputResult } from "@games/types"
import { GameModule } from "@modules/game.module"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { setupDatabase } from "@test-utils/setup-db"
import { getExampleTwitchUserState } from '../../test-utils/example'
import { setup } from '../../test-utils/setup'

fdescribe('test game module', () => {
  let module: GameModule
  let game: Emotegame
  let channel: string

  beforeEach(async () => {
    setup()
    channel = 'channel'
    module = new GameModule()
    game = new Emotegame(channel, 'emote')
    hb.games.addEmoteGame(game)
    await clearDb(hb.db.dataSource)
  })

  beforeAll(async () => {
    await setupDatabase()
    console.log('set up')
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('game returns finished send finish message', async () => {
    const user = getExampleTwitchUserState({})
    const message = ''

    spyOn(hb, 'sendMessage')
    spyOn(game, 'input').and.returnValue(EmoteGameInputResult.FINISHED)

    await module.input(channel, user, message)

    const expectedMesage = `${user.username} has guessed the emote. The emote was ${game.actualEmote}`
    expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
  })

  it('game returns letter correct send letter correct  message', async () => {
    const user = getExampleTwitchUserState({})
    const message = ''
    spyOn(hb, 'sendMessage')
    spyOn(game, 'input').and.returnValue(EmoteGameInputResult.LETTER_CORRECT)

    await module.input(channel, user, message)

    const expectedMesage = `${user.username
      } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`

    expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
  })

  it('game returns finished remove emotegame', async () => {
    const user = getExampleTwitchUserState({})
    const message = ''

    spyOn(hb, 'sendMessage')
    spyOn(game, 'input').and.returnValue(EmoteGameInputResult.FINISHED)

    await module.input(channel, user, message)

    expect(hb.games.eg).toHaveSize(0)
  })

  fdescribe('save finish', () => {
    it('user is new save result to database', async () => {
      const userId = 1

      await module.saveFinishedEmotegame(userId)

      const savedEntity = await hb.db.emoteStatsRepo.findOneBy({
        user: {
          id: userId
        }
      })

      expect(savedEntity?.emote_guesses).toBe(1)

    })
  })
})
