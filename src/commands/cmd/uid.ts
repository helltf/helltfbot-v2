import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class UidCommand implements Command {
  name = 'uid'
  permissions = ChatPermissionLevel.USER
  description = 'retrieves the user id'
  requiredParams: string[] = []
  optionalParams: string[] = ['user']
  alias: string[] = ['userid']
  cooldown = 10000
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  execute = async ({
    message: [searchUser],
    user
  }: CommandContext): Promise<BotResponse> => {
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