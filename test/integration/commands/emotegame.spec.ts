import { ResourceError, ResourceSuccess } from "@api/types"
import { TwitchUserState } from "@client/types"
import {
  Emote,
  EmotegameCommand,
  EmoteType
} from '@commands/cmd/emotegame'
import { Emotegame } from '@games/emotegame'
import { GameService } from '@src/services/game.service'
import { mockEmoteApis } from '@test-utils/mocks'
import { clearDb, clearRedis } from '../../test-utils/clear'
import {
  disconnectDatabase,
  disconnectRedis
} from '../../test-utils/disconnect'
import { getExampleTwitchUserState } from '../../test-utils/example'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test emotegame', () => {
  let user: TwitchUserState
  let messageChannel: string
  let emotegame: EmotegameCommand

  const emoteTypes: EmoteType[] = Object.values(EmoteType)

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    hb.games = new GameService()

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

  describe('execute', () => {
    it('emote type is not ffz, bttv oder 7tv return error response', async () => {
      const type = 'otherType'

      const { response, success } = await emotegame.execute({
        channel: messageChannel,
        user,
        params: {
          action: 'start',
          type
        }
      })

      expect(response).toBe('type has to be ffz, bttv or seventv')
      expect(success).toBe(false)
    })

    it('action is start return successful response', async () => {
      mockEmoteApis()

      const { response, success } = await emotegame.execute({
        channel: messageChannel,
        user,
        params: {
          action: 'start'
        }
      })

      expect(response).toBe(
        'An emotegame has started, the word is ' + Array(5).fill('_').join(' ')
      )
      expect(success).toBe(true)
    })

    it('action is not start or stop return error response', async () => {
      const { response, success } = await emotegame.execute({
        channel: messageChannel,
        user,
        params: {
          action: 't'
        }
      })

      expect(response).toBe('Action has to be either start or stop')
      expect(success).toBe(false)
    })

    emoteTypes.forEach(type => {
      it('action is start with set emotetype return successful response', async () => {
        mockEmoteApis()

        const { response, success } = await emotegame.execute({
          channel: messageChannel,
          user,
          params: {
            action: 'start',
            type
          }
        })

        expect(response).toBe(
          'An emotegame has started, the word is ' +
            Array(5).fill('_').join(' ')
        )
        expect(success).toBe(true)
      })
    })

    it('action is stop return successful response', async () => {
      mockEmoteApis()
      jest.spyOn(hb.games, 'removeAfterTime').mockImplementation(jest.fn())
      hb.games.add(new Emotegame(messageChannel, 'emote'))

      const { response, success } = await emotegame.execute({
        channel: messageChannel,
        user,
        params: {
          action: 'stop'
        }
      })

      expect(response).toBe('The emotegame has been stopped')
      expect(success).toBe(true)
    })

    it('action is start create new game for channel', async () => {
      mockEmoteApis()

      await emotegame.execute({
        channel: messageChannel,
        user,
        params: { action: 'start' }
      })

      expect(hb.games.eg).toHaveLength(1)
      expect(hb.games.eg[0].channel).toBe(messageChannel)
    })

    it('action is start but game already exists return error response', async () => {
      const emote = 'emote'
      mockEmoteApis()

      hb.games.eg.push(new Emotegame(messageChannel, emote))

      const { response, success } = await emotegame.execute({
        channel: messageChannel,
        user,
        params: {
          action: 'start'
        }
      })

      expect(success).toBe(false)
      expect(response).toBe('An emotegame is already running')
    })
  })

  describe('start method', () => {
    emoteTypes.forEach(type => {
      it('get emote returns ResourceError return error response', async () => {
        const error = 'error message'
        jest
          .spyOn(emotegame.methods, 'getEmote')
          .mockResolvedValue(new ResourceError(error))

        const { response, success } = await emotegame.methods.start(
          messageChannel,
          type
        )

        expect(response).toBe(error)
        expect(success).toBe(false)
      })
    })
  })

  describe('stop method', () => {
    it('no game is running return errror response', async () => {
      const { response, success } = await emotegame.methods.stop(messageChannel)

      expect(response).toBe('There is no game running at the moment')
      expect(success).toBe(false)
    })

    it('game is running return successful response', async () => {
      jest.spyOn(hb.games, 'removeAfterTime').mockImplementation(jest.fn())
      hb.games.add(new Emotegame(messageChannel, 'emote'))

      const { response, success } = await emotegame.methods.stop(messageChannel)

      expect(response).toBe('The emotegame has been stopped')
      expect(success).toBe(true)
      expect(hb.games.removeAfterTime).toHaveBeenCalled()
    })
  })

  describe('get emotes method', () => {
    emoteTypes.forEach(type => {
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
        jest
          .spyOn(hb.api[type], 'getEmotesForChannel')
          .mockResolvedValue(new ResourceError('error'))
        await emotegame.methods.getEmotes(messageChannel, type)

        const cachedEmotes = await hb.cache.getEmoteSet(messageChannel, type)

        expect(cachedEmotes).toBeNull()
      })

      it("emotes are not cached but empty array is returned don't cache emotes", async () => {
        jest
          .spyOn(hb.api[type], 'getEmotesForChannel')
          .mockResolvedValue(new ResourceSuccess([]))
        await emotegame.methods.getEmotes(messageChannel, type)

        const cachedEmotes = await hb.cache.getEmoteSet(messageChannel, type)

        expect(cachedEmotes).toBeNull()
      })
    })

    describe('get emote method', () => {
      emoteTypes.forEach(type => {
        it('returns resource error return error message', async () => {
          const error = 'Error message'
          jest
            .spyOn(emotegame.methods, 'getEmotes')
            .mockResolvedValue(new ResourceError(error))

          const result = (await emotegame.methods.getEmote(
            messageChannel,
            type
          )) as ResourceError

          expect(result).toBeInstanceOf(ResourceError)
          expect(result.error).toBe(error)
        })

        it('returns empty array return resource error', async () => {
          jest
            .spyOn(emotegame.methods, 'getEmotes')
            .mockResolvedValue(new ResourceSuccess([]))
          const result = (await emotegame.methods.getEmote(
            messageChannel,
            type
          )) as ResourceError

          expect(result).toBeInstanceOf(ResourceError)
          expect(result.error).toBe(`No emotes were found for ${type} emotes`)
        })

        it('get emotes resolves to array return element from that array', async () => {
          const emotes = ['emote1', 'emote2', 'emote3']
          jest
            .spyOn(emotegame.methods, 'getEmotes')
            .mockResolvedValue(new ResourceSuccess(emotes))

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
