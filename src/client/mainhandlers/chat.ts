import { ChatUserstate } from 'tmi.js'
import { Command } from '../../commands/export/types.js'
import { getUserPermissions } from '../../utilities/twitch/permission.js'
import { PermissionLevel } from '../../utilities/twitch/types.js'
import { BotResponse, TwitchUserState } from '../types.js'

const prefix = process.env.PREFIX

const handleChat = async (
  channel: string,
  user: TwitchUserState,
  message: string,
  self: boolean
) => {
  if (self) return
  updateUser(user)
  if (!message?.toLowerCase()?.startsWith(prefix)) return

  const [commandLookup, ...data] = message
    .substring(prefix.length)
    .replace(/\s{2,}/g, ' ')
    .split(' ')

  const command = hb.getCommand(commandLookup.toLowerCase())

  if (command === undefined || userHasCooldown(command, user)) return

  user.permission = await getUserPermissions(user)

  if (command.permissions > user.permission) return

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

function setCooldown(command: Command, { 'user-id': id }: ChatUserstate) {
  hb.cooldown.setCooldown(command, id!)
}

function userHasCooldown(
  command: Command,
  { 'user-id': id }: ChatUserstate
): boolean | undefined {
  return hb.cooldown.userHasCooldown(command, id!)
}

async function updateUser(user: ChatUserstate) {
  const id = parseInt(user['user-id']!)

  const userEntry = await hb.db.userRepo.findOneBy({
    id: id
  })

  if (userEntry) {
    return await hb.db.userRepo.update(
      {
        id: id
      },
      {
        color: user.color,
        display_name: user['display-name'],
        name: user.username
      }
    )
  }

  hb.db.userRepo.save({
    color: user.color,
    display_name: user['display-name'],
    name: user.username,
    id: id,
    notifications: [],
    permission: PermissionLevel.USER,
    registered_at: Date.now()
  })
}

export { handleChat }
