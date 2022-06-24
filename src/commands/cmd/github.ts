import { Command } from '../types'
import { BotResponse } from '../../client/types'

export class GithubCommand implements Command {
  name = 'github'
  description = 'link to my repo and my github profile'
  permissions = 0
  requiredParams = []
  optionalParams = []
  cooldown = 5000
  alias = []

  async execute(): Promise<BotResponse> {
    const response = `FeelsOkayMan Feel free to leave a follow at https://github.com/helltf and visit the github page for my bot https://github.com/helltf/helltfbot-v2`

    return {
      response,
      success: true
    }
  }
}
