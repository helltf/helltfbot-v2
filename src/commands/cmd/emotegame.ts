import { ChatPermissionLevel } from "@src/utilities/permission/types";
import { Resource, ResourceError, ResourceSuccess } from "../../api/types";
import { BotResponse } from '../../client/types'
import { Emotegame } from '../../games/emotegame'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class EmotegameCommand extends BaseCommand {
  name = 'emotegame'
  permissions = ChatPermissionLevel.USER
  description = 'start or stop an emotegame'
  requiredParams = ['start|stop'] as const
  optionalParams = ['type'] as const
  alias = ['hangman', 'egame', 'bttvgame', 'ffzgame', '7tvgame']
  cooldown = 10000
  flags: CommandFlag[] = [CommandFlag.LOWERCASE]
  async execute({
    channel,
    message: [action, type]
  }: CommandContext<EmotegameCommand>): Promise<BotResponse> {
    const emoteGameAction = action as EmotegameAction
    const emoteGameType = type as EmoteType

    if (!action || (emoteGameAction !== 'start' && emoteGameAction !== 'stop'))
      return {
        response: 'Action has to be either start or stop',
        success: false
      }

    if (emoteGameType && !Object.values(EmoteType).includes(emoteGameType)) {
      return {
        response: 'type has to be ffz, bttv or seventv',
        success: false
      }
    }

    if (emoteGameAction === 'start') {
      return await this.methods.start(channel, emoteGameType)
    }

    return await this.methods.stop(channel)
  }

  methods = {
    start: async (channel: string, type?: EmoteType): Promise<BotResponse> => {
      const emote = await this.methods.getEmote(channel, type)

      if (emote instanceof ResourceError) {
        return {
          success: false,
          response: emote.error
        }
      }

      const game = new Emotegame(channel, emote.data)

      const success = hb.games.add(game)

      return {
        response: success
          ? 'An emotegame has started, the word is ' + game.getLetterString()
          : 'An emotegame is already running',
        success
      }
    },

    stop: async (channel: string): Promise<BotResponse> => {
      if (!hb.games.emoteGameExists(channel)) {
        return {
          success: false,
          response: 'There is no game running at the moment'
        }
      }

      hb.games.removeGameForChannel(channel)

      return {
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

      const randomEmote =
        emotes.data[hb.utils.random(0, emotes.data.length - 1)]

      return new ResourceSuccess(randomEmote)
    },

    getRandomEmoteService() {
      const emoteTypes: EmoteType[] = Object.values(EmoteType)

      return emoteTypes[hb.utils.random(0, emoteTypes.length - 1)]
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
export enum EmoteType {
  FFZ = 'ffz',
  BTTV = 'bttv',
  SEVENTV = 'seventv'
}
export declare type Emote = string
