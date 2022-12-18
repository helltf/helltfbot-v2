import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { CommandFlag } from '../types'
import { BaseCommand } from '../base'

export class GithubCommand extends BaseCommand {
  name = 'github'
  description = 'link to my repo and my github profile'
  permissions = ChatPermissionLevel.USER
  requiredParams = [] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = []
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  execute = async (): Promise<BotResponse> => {
    const response = `FeelsOkayMan Feel free to leave a follow at https://github.com/helltf and visit the github page for my bot https://github.com/helltf/helltfbot-v2`

    return {
      response,
      success: true
    }
  }
}
