import {  CommandContext, CommandFlag } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { BaseCommand } from '../base'

export class SuggestCommand extends BaseCommand {
  name = 'suggest'
  description = 'suggest a feature you want to see'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['suggestion'] as const
  optionalParams = [] as const
  cooldown = 30000
  alias = []
  flags: CommandFlag[] = [CommandFlag.WHISPER, CommandFlag.APPEND_PARAMS]
  async execute({
    user,
    channel,
    params: { suggestion }
  }: CommandContext<SuggestCommand>): Promise<BotResponse> {
    if (!suggestion[0])
      return {
        response: 'You have to specify a suggestion',
        success: false
      }

    const id = await this.methods.saveSuggestion(
      suggestion,
      parseInt(user['user-id']!),
      channel
    )

    await hb.sendMessage(
      process.env.MAIN_USER,
      `@${process.env.MAIN_USER} new suggestion by ${user.username}`
    )

    return {
      response: `Succesfully saved your suggestion with id ${id}`,
      success: true
    }
  }

  methods = {
    async saveSuggestion(
      suggestion: string,
      userId: number,
      channel: string
    ): Promise<number> {
      return (
        await hb.db.suggestion.save({
          date: Date.now(),
          channel,
          suggestion,
          user: {
            id: userId
          }
        })
      ).id
    }
  }
}
