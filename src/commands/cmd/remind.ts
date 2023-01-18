import { Resource, ResourceError } from "@api/types";
import { ReminderEntity } from "@db/entities";
import { BotResponse } from "@src/client/types";
import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class RemindCommand extends BaseCommand {
  name = 'remind'
  permissions = GlobalPermissionLevel.USER
  description = 'create a reminder'
  requiredParams = ['user', 'message'] as const
  optionalParams = [] as const
  alias = ['createreminder']
  flags = [CommandFlag.WHISPER, CommandFlag.APPEND_PARAMS]
  cooldown = 30000
  async execute({
    user,
    channel,
    params
  }: CommandContext<RemindCommand>): Promise<BotResponse> {
    const reminder = await hb.reminder.create({
      message: params.message,
      channel,
      creatorId: Number(user.id),
      recieverName: params.user
    })

    if (reminder instanceof ResourceError) {
      return { success: false, response: reminder.error }
    }

    return {
      success: true,
      response: `Successfully created your reminder with the id ${reminder.data.id}`
    }
  }
}
