import { TwitchUserState, BotResponse } from "../../client/types.js";
import { Emotegame } from "../../games/emotegame.js";
import { PermissionLevel } from "../../utilities/twitch/types.js";
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
      const game = new Emotegame(channel)
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
    }
  }
}

type EmotegameAction = 'stop' | 'start'