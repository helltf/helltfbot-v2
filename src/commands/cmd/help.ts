import { BotResponse } from "@src/client/types";
import { Command, CommandContext } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";

export class HelpCommmand implements Command {
  name = 'help'
  flags: string[] = []
  permissions = ChatPermissionLevel.USER
  description = 'replies with information about the given command'
  optionalParams = ['command']
  requiredParams: string[] = []
  alias = ['command', 'commandinfo', 'commands']
  cooldown = 10000
  execute = async ({
    message: [command]
  }: CommandContext): Promise<BotResponse> => {
    if (!command)
      return {
        response: [
          'Bot created by @helltf',
          'All commands are listed here (coming soon)'
        ],
        success: true
      }

    const foundCommand = hb.getCommand(command)

    if (!foundCommand)
      return {
        success: false,
        response: 'This command does not exist'
      }

    return {
      success: true,
      response: [
        `Name: ${foundCommand.name}`,
        `Aliases: ${foundCommand.alias.join(',')}`,
        `Description: ${foundCommand.description}`,
        `Cooldown: ${foundCommand.cooldown / 1000}s`,
        `Permissions: ${hb.utils.permission.map(foundCommand.permissions)}`,
        `Required params: ${foundCommand.requiredParams.join(',')}`,
        `Optional params: ${foundCommand.optionalParams.join(',')}`
      ]
    }
  }
}