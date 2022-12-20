import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { ChatPermissionLevel } from "@src/utilities/permission/types";
import { BaseCommand } from '../base'

export class EmoteCommand extends BaseCommand {
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  name = 'emote'
  permissions = ChatPermissionLevel.USER
  description = 'sends all emote for the channel'
  requiredParams = [] as const
  optionalParams = ['channel'] as const
  alias: string[] = ['emotes']
  cooldown = 20000

  async execute({
    channel,
    params: { channel: channelParam }
  }: CommandContext<EmoteCommand>): Promise<BotResponse> {
    const emoteChannel = !channelParam ? channel : channelParam

    const { ffz, bttv, seventv } = await hb.api.fetchAllEmotes(emoteChannel)

    const ffzHasEmotes = !!ffz.length
    const bttvHasEmotes = !!bttv.length
    const seventvHasEmotes = !!seventv.length

    if (!ffzHasEmotes && !bttvHasEmotes && !seventvHasEmotes)
      return {
        success: false,
        response: 'No emotes found'
      }

    const responses = []

    if (ffzHasEmotes) responses.push(`FFZ: ${ffz.join(' ')}`)

    if (bttvHasEmotes) responses.push(`BTTV: ${bttv.join(' ')}`)

    if (seventvHasEmotes) responses.push(`7TV: ${seventv.join(' ')}`)

    return {
      success: true,
      response: responses
    }
  }
}
