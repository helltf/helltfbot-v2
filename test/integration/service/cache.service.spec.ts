import { EmoteType } from '@commands/cmd/emotegame'
import { wait } from '@utilities/wait'
import { clearRedis } from '../../test-utils/clear'
import { disconnectRedis } from '../../test-utils/disconnect'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test redis service', () => {
  const emoteTypes: EmoteType[] = Object.values(EmoteType)
  let channel: string

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    channel = 'channel'
    await clearRedis()
  })

  afterAll(async () => {
    await disconnectRedis()
  })

  emoteTypes.forEach(eType => {
    it('get emote set key should return channel with type', () => {
      const key = hb.cache.getEmoteSetKey(channel, eType)

      expect(key).toBe(`emoteset:${channel}-${eType}`)
    })
  })

  emoteTypes.forEach(eType => {
    it('save emote set should cache whole array in redis', async () => {
      const emotes = ['a']

      await hb.cache.saveEmoteSet(emotes, channel, eType)
      const key = hb.cache.getEmoteSetKey(channel, eType)
      const savedEmotesString = await hb.cache.redis.get(key)

      expect(savedEmotesString).not.toBeNull()

      const savedEmotes = JSON.parse(savedEmotesString!)

      expect(savedEmotes).toEqual(emotes)
    })
  })
  emoteTypes.forEach(eType => {
    it('get emote set key does not exist return null', async () => {
      const result = await hb.cache.getEmoteSet(channel, eType)

      expect(result).toBeNull()
    })
  })

  emoteTypes.forEach(eType => {
    it('get emote set return correct values for existing key', async () => {
      const emotes = ['a', 'b']

      await hb.cache.saveEmoteSet(emotes, channel, eType)

      const result = await hb.cache.getEmoteSet(channel, eType)

      expect(result).toEqual(emotes)
    })
  })

  emoteTypes.forEach(eType => {
    it('get emote set returns null after key expires', async () => {
      const emotes = ['a', 'b']
      hb.cache.DEFAULT_EMOTE_EXPIRE_TIME = 1

      await hb.cache.saveEmoteSet(emotes, channel, eType)

      await wait`2s`

      const result = await hb.cache.getEmoteSet(channel, eType)

      expect(result).toBeNull()
    })
  })
})
