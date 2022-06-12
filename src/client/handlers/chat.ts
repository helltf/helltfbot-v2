import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { ChatUserstate } from 'tmi.js'
import { Command } from '../../commands/types'
import { BotResponse, TwitchUserState } from '../types'

const prefix = process.env.PREFIX

const handleChat = async (
  channel: string,
  user: TwitchUserState,
  message: string,
  self: boolean
) => {
  if (self) return

  if (!message?.toLowerCase()?.startsWith(prefix)) return

  const [commandLookup, ...data] = message
    .substring(prefix.length)
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  const command = hb.getCommand(commandLookup.toLowerCase())

  if (command === undefined || userHasCooldown(command, user)) return

  incrementCommandCounter(command)
  user.permission = await hb.utils.permission.get(user)

  if (command.permissions > user.permission!) return

  setCooldown(command, user)

  const response = await command.execute(channel, user, data)

  sendResponse(response)
}

function sendMessage(channel: string, message: string) {
  hb.sendMessage(channel, message)
}

function sendResponse({ success, response, channel }: BotResponse) {
  if (!response) return

  if (success) {
    sendMessage(channel, response)
  } else {
    sendMessage(channel, `❗ Error while executing ➡ ` + response)
  }
}

function setCooldown(
  command: Command,
  { 'user-id': id, permission }: TwitchUserState
) {
  if (permission! >= GlobalPermissionLevel.ADMIN) return
  hb.cooldown.setCooldown(command, id!)
}

function userHasCooldown(
  command: Command,
  { 'user-id': id }: ChatUserstate
): boolean | undefined {
  return hb.cooldown.userHasCooldown(command, id!)
}

async function incrementCommandCounter(command: Command) {
  await hb.db.commandRepo.increment(
    {
      name: command.name
    },
    'counter',
    1
  )
}

export { handleChat }
