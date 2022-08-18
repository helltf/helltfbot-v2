import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class StatsCommand implements Command {
  name = 'stats'
  permissions: number = ChatPermissionLevel.USER
  description = 'displays your stats'
  requiredParams: string[] = ['type']
  optionalParams: string[] = ['user']
  alias: string[] = ['statistics']
  cooldown = 20000
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  execute = async ({
    message: [type, lookup],
    user
  }: CommandContext): Promise<BotResponse> => {
    const username = lookup !== undefined ? lookup : user.username!

    if (!this.methods.isValidType(type))
      return {
        response: `Valid stats are ${Object.values(StatsType)}`,
        success: false
      }

    if (type === StatsType.EMOTEGAME)
      return await this.methods.getEmotegameStats(username)

    return {
      response: 'unknown error',
      success: false
    }
  }

  methods = {
    isValidType(type: string): boolean {
      return hb.utils.enumContains(StatsType, type)
    },

    async getLeaderboardPosition(username: string): Promise<number> {
      const userStats = await hb.db.emoteStats.find({
        order: { emotes_guessed: 'DESC' },
        relations: {
          user: true
        }
      })

      return userStats?.findIndex(v => v.user.name === username) + 1
    },

    getEmotegameStats: async (username: string): Promise<BotResponse> => {
      const statsPromise = await hb.db.emoteStats.findOneBy({
        user: {
          name: username
        }
      })

      const [stats, position] = await Promise.all([
        statsPromise,
        this.methods.getLeaderboardPosition(username)
      ])

      if (!stats)
        return {
          success: false,
          response: `${username} has no stats recorded`
        }

      const { emotes_guessed, incorrect_guesses, letters_guessed } = stats

      return {
        response: [
          `${username} guessed ${letters_guessed} letters`,
          `${emotes_guessed} emotes`,
          `${incorrect_guesses} times incorrect`,
          `Position: ${position}`
        ],
        success: true
      }
    }
  }
}

export enum StatsType {
  EMOTEGAME = 'emotegame'
}