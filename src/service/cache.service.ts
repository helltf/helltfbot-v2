import { RedisClientType, createClient } from "redis"
import { EmoteType } from "../commands/cmd/emotegame.js"

const DEFAULT_EMOTE_EXPIRE_TIME = 60 * 15 

export class CacheService {
  redis: RedisClientType
  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL
    })
  }

  async connect() {
    await this.redis.connect()
  }

  getEmoteSetKey(channel: string, type: EmoteType) {
    return `emoteset:${channel}-${type}`
  }

  async saveEmoteSet(emotes: string[], channel: string, type: EmoteType) {
    const emoteString = JSON.stringify(emotes)

    const redisKey = this.getEmoteSetKey(channel, type)

    await this.redis.set(redisKey, emoteString, {
      EX: DEFAULT_EMOTE_EXPIRE_TIME
    })
  }

  async getEmoteSet(
    channel: string,
    type: EmoteType
  ): Promise<string[] | null> {
    const redisKey = this.getEmoteSetKey(channel, type)
    const result = await this.redis.get(redisKey)

    return result === null ? null : JSON.parse(result)
  }
}
