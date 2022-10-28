import { RedisClientType, createClient } from "redis"
import { Emote, EmoteType } from "../commands/cmd/emotegame"


export class CacheService {
  DEFAULT_EMOTE_EXPIRE_TIME = 60 * 15
  redis: RedisClientType
  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL
    })
  }

  async connect() {
    await this.redis.connect()
    return this
  }

  getEmoteSetKey(channel: string, type: EmoteType) {
    return `emoteset:${channel}-${type}`
  }

  async saveEmoteSet(emotes: Emote[], channel: string, type: EmoteType) {
    const emoteString = JSON.stringify(emotes)

    const redisKey = this.getEmoteSetKey(channel, type)

    await this.redis.set(redisKey, emoteString, {
      EX: this.DEFAULT_EMOTE_EXPIRE_TIME
    })
  }

  async getEmoteSet(channel: string, type: EmoteType): Promise<Emote[] | null> {
    const redisKey = this.getEmoteSetKey(channel, type)
    const result = await this.redis.get(redisKey)

    return result === null ? null : JSON.parse(result)
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value)
  }

  async getString(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async getObject<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
}
