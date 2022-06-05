import { Emotegame } from "../../../src/games/emotegame.js"
import { EmoteGameInputResult } from "../../../src/games/types.js"
import { GameModule } from "../../../src/modules/game.module.js"
import { getExampleTwitchUserState } from '../../test-utils/example.js'
import { setup } from '../../test-utils/setup.js'

fdescribe('test game module', () => {
  let module: GameModule
  let game: Emotegame

  beforeEach(() => {
    module = new GameModule()
    setup()
    game = new Emotegame('channel', 'emote')
    spyOn(hb.games, 'getGame').and.returnValue(game)
  })

  it('game returns finished send finish message', () => {
    const channel = 'channel'
    const user = getExampleTwitchUserState({})
    const message = ''

    spyOn(hb, 'sendMessage')
    spyOn(game, 'input').and.returnValue(EmoteGameInputResult.FINISHED)

    module.input(channel, user, message)

    const expectedMesage = `${user.username} has guessed the emote. The emote was ${game.emote}`
    expect(hb.sendMessage).toHaveBeenCalledWith(expectedMesage)
  })

  it('game returns letter correct send letter correct  message', () => {
    const channel = 'channel'
    const user = getExampleTwitchUserState({})
    const message = ''
    spyOn(hb, 'sendMessage')
    spyOn(game, 'input').and.returnValue(EmoteGameInputResult.LETTER_CORRECT)

    module.input(channel, user, message)

    const expectedMesage = `${
      user.username
    } has guessed the letter ${message}. The missing letters are ${game.getLetterString()}`

    expect(hb.sendMessage).toHaveBeenCalledWith(expectedMesage)
  })
})
