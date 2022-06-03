import { TwitchUserState } from "../../../src/client/types.js"
import { EmotegameCommand } from "../../../src/commands/cmd/emotegame.js"
import { Emotegame } from "../../../src/games/emotegame.js"
import { GameService } from '../../../src/service/game.service.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test emotegame', () => {
  let user: TwitchUserState
  let messageChannel: string
  let emotegame: EmotegameCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    hb.games = new GameService()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    user = getExampleTwitchUserState({})
    messageChannel = 'messageChannel'
    emotegame = new EmotegameCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('no action given return error response', async () => {
    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, [])

    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeFalse()
    expect(response).toBe(
      'No action defined. Either start or stop an emotegame'
    )
  })

  it('action is start return successful response', async () => {
    const message = ['start']

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('An emotegame has started')
    expect(success).toBeTrue()
  })

  it('action is stop return successful response', async () => {
    const message = ['stop']

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('The emotegame has been stopped')
    expect(success).toBeTrue()
  })

  it('action is start create new game for channel', async () => {
    const message = ['start']

    await emotegame.execute(messageChannel, user, message)

    expect(hb.games.eg).toHaveSize(1)
    expect(hb.games.eg[0].channel).toBe(messageChannel)
  })

  it('action is start but game already exists return error response', async () => {
    const message = ['start']
    const emote = 'emote'

    hb.games.eg.push(new Emotegame(messageChannel, emote))

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeFalse()
    expect(response).toBe('An emotegame is already running')
  })
})
  
