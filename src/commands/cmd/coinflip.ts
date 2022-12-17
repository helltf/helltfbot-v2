import { BotResponse } from '@src/client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { Command, CommandFlag } from '../types'

export class CoinflipCommand implements Command {
  name = 'coinflip'
  permissions = ChatPermissionLevel.USER
  description = 'flips a coin'
  requiredParams = []
  optionalParams = []
  alias = ['cf']
  flags = [CommandFlag.WHISPER]
  cooldown = 15000
  execute = async (): Promise<BotResponse> => {
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
