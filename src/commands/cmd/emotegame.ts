import { TwitchUserState, BotResponse } from "../../client/types.js";
import { PermissionLevel } from "../../utilities/twitch/types.js";
import { Command } from "../types.js";

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
    message: string[]
  ): Promise<BotResponse> {
    return {
      channel: channel,
      response: '',
      success: true
    }
  }
}