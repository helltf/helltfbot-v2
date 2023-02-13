import { BotResponse } from '@src/client/types';
import {  CommandFlag } from '@src/commands/types'
import {
  ChatPermissionLevel,
} from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'

export class RandomColorCommand extends BaseCommand {
  name = 'randomcolor'
  permissions = ChatPermissionLevel.USER
  description = 'generates a random hex color'
  requiredParams = [] as const
  optionalParams = [] as const
  alias = ['rc']
  flags = [CommandFlag.WHISPER]
  cooldown = 10000

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute(): Promise<BotResponse> {
    return { response: this.methods.generateHex(), success: true }
  }

  methods = {
    generateHex: (): string => {
      const chars = Array(6)
        .fill('1')
        .map(() => {
          return this.static.chars[
            hb.utils.random(0, this.static.chars.length - 1)
          ]
        })

      return '#' + chars.join('')
    }
  }

  static = {
    chars: [
      '0',
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
