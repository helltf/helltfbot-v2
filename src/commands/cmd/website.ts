import {  CommandFlag } from '../types'
import { BotResponse } from '../../client/types'
import { BaseCommand } from '../base'
import { ChatPermissionLevel } from '../../utilities/permission/types'

export class WebsiteCommand extends BaseCommand {
  name = 'website'
  description = 'link to my website'
  permissions = ChatPermissionLevel.USER
  requiredParams = [] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = []
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute(): Promise<BotResponse>  {
    const response =
      `You can inspect my website on https://helltf.github.io/bot/#/ ` +
      `The website has been build with Vue https://vuejs.org/ and the backend is a flask https://flask.palletsprojects.com/en/2.1.x/ python webserver` +
      ` hosting a GraphQL API `

    return {
      response,
      success: true
    }
  }
}
