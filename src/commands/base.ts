import { Resource, ResourceError, ResourceSuccess } from "@api/types"
import { BotResponse,  TwitchUserState } from "@src/client/types"
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
  }): Resource<CommandContext<T>> {
    const paramList = [...this.requiredParams, ...this.optionalParams]

    if (message.length < this.requiredParams.length) {
      return new ResourceError(
        `Missing param ${this.requiredParams[message.length]}`
      )
    }
    const params: {
      [key in string]: string
    } = {}

    console.log(this)
    paramList.forEach((param: string, i: number) => {
      if (
        i == paramList.length - 1 &&
        this.flags?.includes(CommandFlag.APPEND_PARAMS)
      ) {
        return (params[param] = message.slice(i, message.length).join(' '))
      }
      params[param] = message[i]
    })

    return new ResourceSuccess({
      user,
      type,
      channel: where,
      params
    })
  }
}
