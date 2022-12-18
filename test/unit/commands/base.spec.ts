import { BotResponse } from '@src/client/types'
import { BaseCommand } from '@src/commands/base'
import {  CommandContext, CommandFlag } from '@src/commands/types'
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

class TestBaseCommand extends BaseCommand {
  name = 'test'
  permissions = GlobalPermissionLevel.USER
  description = 'this is a test command'
  requiredParams = []
  optionalParams = []
  alias = []
  execute = async () => {}
}

describe('base command', () => {
  let testcommand = new TestBaseCommand()
})
