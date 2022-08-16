import { BotResponse } from '@src/client/types';
import { Command, CommandContext, CommandFlag } from '@src/commands/types'
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class RandomColorCommand implements Command {
  name = 'randomcolor'
  permissions = ChatPermissionLevel.USER
  description = 'generates a random hex color'
  requiredParams = []
  optionalParams = []
  alias = ['rc']
  flags = [CommandFlag.WHISPER]
  cooldown = 10000
  execute = async (): Promise<BotResponse> => {
    return { response: this.methods.generateHex(), success: true }
  }

  methods = {
    generateHex: (): string => {
      const chars = Array(6).map(
        () => this.static.chars[hb.utils.random(0, this.static.chars.length)]
      )
      return '#'
    }
  }

  static = {
    chars: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F'
    ]
  }
}
