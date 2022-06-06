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
}
