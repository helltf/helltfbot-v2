import {  ResourceError, ResourceSuccess } from "../../../src/api/types.js"
import { TwitchUserState } from "../../../src/client/types.js"
import {
  Emote,
  EmotegameCommand,
  EmoteType
} from '../../../src/commands/cmd/emotegame.js'
import { Emotegame } from '../../../src/games/emotegame.js'
import { GameService } from '../../../src/service/game.service.js'
import { clearDb, clearRedis } from '../../test-utils/clear.js'
import {
  disconnectDatabase,
  disconnectRedis
} from '../../test-utils/disconnect.js'
import { getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('test emotegame', () => {
  let user: TwitchUserState
  let messageChannel: string
  let emotegame: EmotegameCommand
  const emoteTypes: EmoteType[] = [
    EmoteType.BTTV,
    EmoteType.FFZ,
    EmoteType.SEVENTV
  ]

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
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectDatabase()
    await disconnectRedis()
  })

  it('no action given return error response', async () => {
    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, [])

    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeFalse()
    expect(response).toBe('Action has to be either start or stop')
  })

  it('emote type is not ffz, bttv oder 7tv return error response', async () => {
    const type = 'otherType'
    const message = ['start', type]

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('type has to be ffz, bttv or seventv')
    expect(success).toBeFalse()
  })

  it('action is start return successful response', async () => {
    const message = ['start']
    mockEmoteApis()

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe(
      'An emotegame has started, the word is ' + Array(5).fill('_').join(' ')
    )
    expect(success).toBeTrue()
  })

  it('action is not start or stop return error response', async () => {
    const message = ['b']

    const {
      channel: responseChannel,
      response,
      success
    } = await emotegame.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Action has to be either start or stop')
    expect(success).toBeFalse()
  })

  emoteTypes.forEach((type) => {
    it('action is start with set emotetype return successful response', async () => {
      mockEmoteApis()
      const message = ['start', type]

      const {
        channel: responseChannel,
        response,
        success
      } = await emotegame.execute(messageChannel, user, message)

      expect(responseChannel).toBe(messageChannel)
      expect(response).toBe(
        'An emotegame has started, the word is ' + Array(5).fill('_').join(' ')
      )
      expect(success).toBeTrue()
    })
  })

  it('action is stop return successful response', async () => {
    const message = ['stop']
    mockEmoteApis()
    hb.games.add(new Emotegame(messageChannel, 'emote'))
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
    mockEmoteApis()

    await emotegame.execute(messageChannel, user, message)

    expect(hb.games.eg).toHaveSize(1)
    expect(hb.games.eg[0].channel).toBe(messageChannel)
  })

  it('action is start but game already exists return error response', async () => {
    const message = ['start']
    const emote = 'emote'
    mockEmoteApis()

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

  describe('start method', () => {
    emoteTypes.forEach((type) => {
      it('get emote returns ResourceError return error response', async () => {
        const error = 'error message'
        spyOn(emotegame.methods, 'getEmote').and.resolveTo(
          new ResourceError(error)
        )

        const {
          channel: responseChannel,
          response,
          success
        } = await emotegame.methods.start(messageChannel, type)

        expect(responseChannel).toBe(messageChannel)
        expect(response).toBe(error)
        expect(success).toBeFalse()
      })
    })
  })

  describe('stop method', () => {
    it('no game is running return errror response', async () => {
      const {
        channel: responseChannel,
        response,
        success
      } = await emotegame.methods.stop(messageChannel)

      expect(responseChannel).toBe(messageChannel)
      expect(response).toBe('There is no game running at the moment')
      expect(success).toBeFalse()
    })

    it('game is running return successful response', async () => {
      hb.games.add(new Emotegame(messageChannel, 'emote'))

      const {
        channel: responseChannel,
        response,
        success
      } = await emotegame.methods.stop(messageChannel)

      expect(responseChannel).toBe(messageChannel)
      expect(response).toBe('The emotegame has been stopped')
      expect(success).toBeTrue()
    })

    it('game is running stops removes the game', async () => {
      spyOn(hb.games, 'removeGameForChannel')

      hb.games.add(new Emotegame(messageChannel, 'emote'))

      await emotegame.methods.stop(messageChannel)

      expect(hb.games.removeGameForChannel).toHaveBeenCalledWith(messageChannel)
    })
  })

  describe('get emotes method', () => {
    emoteTypes.forEach((type) => {
      it('emotes are cached return cached emotes', async () => {
        mockEmoteApis()
        const emotes = ['emote']
        await hb.cache.saveEmoteSet(emotes, messageChannel, type)

        const cachedEmotes = (await emotegame.methods.getEmotes(
          messageChannel,
          type
        )) as ResourceSuccess<Emote[]>

        expect(cachedEmotes).toBeInstanceOf(ResourceSuccess)
        expect(cachedEmotes.data).toEqual(emotes)
      })

      it('emotes are not cached return emotes from api', async () => {
        const emotes = ['emote', 'emote2', 'emote3']
        mockEmoteApis(emotes)

        const resultEmotes = (await emotegame.methods.getEmotes(
          messageChannel,
          type
        )) as ResourceSuccess<Emote[]>

        expect(resultEmotes).toBeInstanceOf(ResourceSuccess)
        expect(resultEmotes.data).toEqual(emotes)
      })

      it('emotes are not cached cache emotes from api', async () => {
        const emotes = ['emote', 'emote2', 'emote3']
        mockEmoteApis(emotes)

        await emotegame.methods.getEmotes(messageChannel, type)

        const cachedEmotes = await hb.cache.getEmoteSet(messageChannel, type)!

        expect(cachedEmotes).toEqual(emotes)
      })

      it("emotes are not cached but error is returned from api emotes don't get cached", async () => {
        spyOn(hb.api[type], 'getEmotesForChannel').and.resolveTo(
          new ResourceError('error')
        )
        await emotegame.methods.getEmotes(messageChannel, type)

        const cachedEmotes = await hb.cache.getEmoteSet(messageChannel, type)

        expect(cachedEmotes).toBeNull()
      })

      it("emotes are not cached but empty array is returned don't cache emotes", async () => {
        spyOn(hb.api[type], 'getEmotesForChannel').and.resolveTo(
          new ResourceSuccess([])
        )
        await emotegame.methods.getEmotes(messageChannel, type)

        const cachedEmotes = await hb.cache.getEmoteSet(messageChannel, type)

        expect(cachedEmotes).toBeNull()
      })
    })

    describe('get emote method', () => {
      emoteTypes.forEach((type) => {
        it('returns resource error return error message', async () => {
          const error = 'Error message'
          spyOn(emotegame.methods, 'getEmotes').and.resolveTo(
            new ResourceError(error)
          )

          const result = (await emotegame.methods.getEmote(
            messageChannel,
            type
          )) as ResourceError

          expect(result).toBeInstanceOf(ResourceError)
          expect(result.error).toBe(error)
        })

        it('returns empty array return resource error', async () => {
          spyOn(emotegame.methods, 'getEmotes').and.resolveTo(
            new ResourceSuccess([])
          )
          const result = (await emotegame.methods.getEmote(
            messageChannel,
            type
          )) as ResourceError

          expect(result).toBeInstanceOf(ResourceError)
          expect(result.error).toBe(`No emotes were found for ${type} emotes`)
        })

        it('get emotes resolves to array return element from that array', async () => {
          const emotes = ['emote1', 'emote2', 'emote3']
          spyOn(emotegame.methods, 'getEmotes').and.resolveTo(
            new ResourceSuccess(emotes)
          )

          const result = (await emotegame.methods.getEmote(
            messageChannel,
            type
          )) as ResourceSuccess<Emote>

          expect(emotes).toContain(result.data)
        })
      })
    })
  })
})

function mockEmoteApis(resolveTo: Emote[] = ['emote']) {
  const result = new ResourceSuccess(resolveTo)

  spyOn(hb.api.bttv, 'getEmotesForChannel').and.resolveTo(result)
  spyOn(hb.api.ffz, 'getEmotesForChannel').and.resolveTo(result)
  spyOn(hb.api.seventv, 'getEmotesForChannel').and.resolveTo(result)
}