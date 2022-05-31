import { Command } from '../export/types.js'
import { BotResponse } from '../../client/types.js'

export class GithubCommand implements Command {
  name = 'github'
  description = 'Link to my repo and my github profile'
  permissions = 0
  requiredParams = []
  optionalParams = []
  cooldown = 5000
  alias = []

  async execute(channel: string): Promise<BotResponse> {
    const response =
      `You can find my github profile by following this link https://github.com/helltf . ` +
      `Feel free to leave a follow <3 To visit the github page for this bot go to https://github.com/helltf/helltfbot-v2`

    return { response, channel, success: true }
  }
}
