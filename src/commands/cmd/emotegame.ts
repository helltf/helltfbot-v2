import { Resource, ResourceError, ResourceSuccess } from "../../api/types.js";
import { TwitchUserState, BotResponse } from "../../client/types.js";
import { Emotegame } from '../../games/emotegame.js'
import { random } from '../../utilities/random.js'
import { PermissionLevel } from '../../utilities/twitch/types.js'
import { Command } from '../types.js'

export class EmotegameCommand implements Command {
  name = 'emotegame'
  permissions = PermissionLevel.USER
  description = 'start or stop an emotegame'
  requiredParams = ['start|stop']
  optionalParams: string[]
  alias = ['hangman', 'egame', 'bttvgame', 'ffzgame', '7tvgame']
  cooldown = 10000
  async execute(
    channel: string,
    userstate: TwitchUserState,
    [action]: string[]
  ): Promise<BotResponse> {
    const emoteGameAction = action as EmotegameAction

    if (!action)
      return {
        channel: channel,
        response: 'No action defined. Either start or stop an emotegame',
        success: false
      }

    if (emoteGameAction === 'start') return await this.methods.start(channel)

    return await this.methods.stop(channel)
  }

  methods = {
    start: async (channel: string): Promise<BotResponse> => {
      const emote = await this.methods.getEmote(channel)

      const game = new Emotegame(channel, emote)

      const success = hb.games.add(game)

      return {
        channel,
        response: success
          ? 'An emotegame has started'
          : 'An emotegame is already running',
        success
      }
    },

    stop: async (channel: string): Promise<BotResponse> => {
      return {
        channel: channel,
        response: 'The emotegame has been stopped',
        success: true
      }
    },

    getEmote: async (
      channel: string,
      type?: EmoteType
    ): Promise<Resource<Emote>> => {
      type = type ?? this.methods.getRandomEmoteService()
      const emotes = await this.methods.getEmotes(channel, type)

      if (emotes instanceof ResourceError) {
        return new ResourceError(emotes.error)
      }

      if (!emotes.data.length) {
        return new ResourceError(`No emotes were found for ${type} emotes`)
      }

      return new ResourceSuccess(emotes[random(0, emotes.length)])
    },

    getRandomEmoteService() {
      const emoteTypes: EmoteType[] = ['bttv', 'ffz', 'seventv']

      return emoteTypes[random(0, 2)]
    },

    getEmotes: async (
      channel: string,
      type: EmoteType
    ): Promise<Resource<Emote[]>> => {
      const cachedEmotes = await hb.cache.getEmoteSet(channel, type)

      if (cachedEmotes) return new ResourceSuccess(cachedEmotes)

      const apiEmotes = await hb.api[type].getEmotesForChannel(channel)

      if (apiEmotes instanceof ResourceSuccess && apiEmotes.data.length) {
        await hb.cache.saveEmoteSet(apiEmotes.data, channel, type)
      }

      return apiEmotes
    }
  }
}

declare type EmotegameAction = 'stop' | 'start'
export declare type EmoteType = 'ffz' | 'bttv' | 'seventv'
export declare type Emote = string