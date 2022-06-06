import { Emotegame } from "@games/emotegame"
import { EmoteGameInputResult } from "@games/types"
import { GameModule } from "@modules/game.module"
import { getExampleTwitchUserState } from '../../test-utils/example'
import { setup } from '../../test-utils/setup'

describe('test game module', () => {
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
    expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
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

    expect(hb.sendMessage).toHaveBeenCalledWith(channel, expectedMesage)
  })
})
