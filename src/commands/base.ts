import { Resource, ResourceError, ResourceSuccess } from "@api/types"
import { BotResponse, InputContext, TwitchUserState } from "@src/client/types"
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'
import { Command, CommandContext, CommandFlag, MessageType } from './types'

export abstract class BaseCommand implements Command {
  async execute<T extends BaseCommand>(
    /* eslint-disable */
    context: CommandContext<T>
  ): Promise<BotResponse> {
    return { response: 'No Implementation found', success: false }
  }
  name: string
  permissions: ChatPermissionLevel | GlobalPermissionLevel
  description: string
  readonly requiredParams: any
  readonly optionalParams: any
  alias: string[]
  flags: CommandFlag[]
  cooldown: number
  methods?: { [key: string]: (...args: any) => any } | undefined
  static?: { [key: string]: any } | undefined
  evaluate = (context: {
    message: string[]
    type: MessageType
  }): Resource<null> => {
    if (
      context.type === MessageType.WHISPER &&
      !this.flags.includes(CommandFlag.WHISPER)
    ) {
      return new ResourceError('This command is not available via whispers')
    }

    return new ResourceSuccess(null)
  }
  buildContext<T extends BaseCommand>({
    message,
    type,
    user,
    where
  }: {
    message: string[]
    type: MessageType
    user: TwitchUserState
    where: string
  }): CommandContext<T> {
    return {
      message,
      user,
      type,
      channel: where,
      params
    }
  }
}
