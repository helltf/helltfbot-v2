import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'

export class UidCommand extends BaseCommand {
  name = 'uid'
  permissions = ChatPermissionLevel.USER
  description = 'retrieves the user id'
  requiredParams = [] as const
  optionalParams = ['user'] as const
  alias: string[] = ['userid']
  cooldown = 10000
  flags: CommandFlag[] = [CommandFlag.WHISPER]

  constructor(deps: CommandDependencies) {
    super(deps)
  }

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
      return this.deps.api.twitch.getUserIdByName(username)
    }
  }
}
