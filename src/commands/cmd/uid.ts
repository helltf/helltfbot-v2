
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandFlag, CommandContext } from '../types'

export class UidCommand extends BaseCommand {
  name = 'uid'
  permissions = ChatPermissionLevel.USER
  description = 'retrieves the user id'
  requiredParams = [] as const
  optionalParams = ['user'] as const
  alias: string[] = ['userid']
  cooldown = 10000
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute({
    user,
    params: { user: searchUser }
  }: CommandContext<UidCommand>): Promise<BotResponse> {
    if (!searchUser)
      return {
        response: this.methods.getResponse(user['user-id'], user.username),
        success: true
      }

    const id = await this.methods.getId(searchUser)

    if (!id)
      return {
        response: 'Could not find user',
        success: false
      }

    return {
      response: this.methods.getResponse(id, searchUser),
      success: true
    }
  }
  methods = {
    getResponse(id?: number | string, username?: string): string {
      return `${username}👉${id}`
    },
    getId(username: string): Promise<number | undefined> {
      return hb.api.twitch.getUserIdByName(username)
    }
  }
}
