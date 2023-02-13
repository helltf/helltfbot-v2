import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'

export class HelpCommmand extends BaseCommand {
  name = 'help'
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  permissions = ChatPermissionLevel.USER
  description = 'replies with information about the given command'
  optionalParams = ['command'] as const
  requiredParams: string[] = []
  alias = ['command', 'commandinfo', 'commands']
  cooldown = 10000

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute({
    params: { command }
  }: CommandContext<HelpCommmand>): Promise<BotResponse> {
    if (!command)
      return {
        response: [
          'Bot created by @helltf',
          'All commands are listed here https://github.com/helltf/helltfbot-v2/blob/master/Commands.md'
        ],
        success: true
      }

    const foundCommand = this.deps.getCommand(command)

    if (!foundCommand)
      return {
        success: false,
        response: 'This command does not exist'
      }

    return {
      success: true,
      response: [
        `Name: ${foundCommand.name}`,
        ...(foundCommand.alias.length
          ? [`Aliases: ${foundCommand.alias.join(',')}`]
          : []),
        `Description: ${foundCommand.description}`,
        `Cooldown: ${foundCommand.cooldown / 1000}s`,
        `Permissions: ${this.deps.utils.permission.map(foundCommand.permissions)}`,
        ...(foundCommand.requiredParams.length
          ? [`Required params: ${foundCommand.requiredParams.join(',')}`]
          : []),
        ...(foundCommand.optionalParams.length
          ? [`Optional params: ${foundCommand.optionalParams.join(',')}`]
          : [])
      ]
    }
  }
}
