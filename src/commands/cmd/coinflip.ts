import { BotResponse } from '@src/client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'
import { CommandFlag } from '../types'

export class CoinflipCommand extends BaseCommand {
  name = 'coinflip'
  permissions = ChatPermissionLevel.USER
  description = 'flips a coin'
  requiredParams = [] as const
  optionalParams = [] as const
  alias = ['cf']
  flags = [CommandFlag.WHISPER]
  cooldown = 15000

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute(): Promise<BotResponse> {
    const flipResult = this.methods.flipCoin()

    return {
      response: `You flipped ${flipResult ? 'heads' : 'tails'} (${
        flipResult ? 'yes' : 'no'
      })`,
      success: true
    }
  }
  methods = {
    flipCoin: (): boolean => {
      return hb.utils.random(0, 1) === 1
    }
  }
}
