import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { wait } from '@src/utilities/wait'
import { ChatUserstate } from 'tmi.js'
import { Command, CommandFlag, MessageType } from '../../commands/types'
import { ChatContext, ResponseContext, TwitchUserState } from '../types'

const prefix = process.env.PREFIX

const handleChat = async (
  where: string,
  user: TwitchUserState,
  message: string,
  self: boolean
) => {
  const chatContext: ChatContext = {
    where: where,
    user: user,
    message: message,
    self: self,
    type: MessageType.MESSAGE
  }

  runCommand(chatContext)
}

export const handleWhisper = async (
  from: string,
  user: TwitchUserState,
  message: string,
  self: boolean
) => {
  const chatContext: ChatContext = {
    where: from,
    user: user,
    message: message,
    self: self,
    type: MessageType.WHISPER
  }

  runCommand(chatContext)
}

const hasPrefix = (message: string): boolean => {
  return message?.toLowerCase()?.startsWith(prefix)
}

async function runCommand({ message, self, type, user, where }: ChatContext) {
  if (self) return

  if (!hasPrefix(message)) return

  const [commandLookup, ...data] = getMessageInfo(message)
  let contextMessage = data
  const command = hb.getCommand(commandLookup)

  if (!command) return

  user.permission = await hb.utils.permission.get(user)

  if (
    type === MessageType.WHISPER &&
    !command.flags.includes(CommandFlag.WHISPER)
  )
    return sendResponse({
      where,
      response: {
        response: 'This command is not available via whispers',
        success: true
      },
      type
    })

  if (userHasCooldown(command, user)) return

  if (command.flags.includes(CommandFlag.LOWERCASE))
    contextMessage = contextMessage.map(m => m.toLowerCase())

  setCooldown(command, user)

  const response = await command.execute({
    channel: where,
    message: contextMessage,
    type: type,
    user: user
  })

  incrementCommandCounter(command)

  sendResponse({ where, type, response })
}

function getMessageInfo(message: string): string[] {
  return message
    .substring(prefix.length)
    .replace(/\s{2,}/g, ' ')
    .split(' ')
}

function sendMessage(channel: string, message: string) {
  hb.sendMessage(channel, message)
}

async function sendWhisper(user: string, message: string) {
  const msgParts = message.match(/.{1,450}(?=\s|$)/g)

  for await (const msg of msgParts!) {
    await hb.client.whisper(user, msg)
    await wait`1s`
  }
}

function sendResponse({
  where,
  response: { success, response },
  type
}: ResponseContext) {
  if (!response) return

  response = Array.isArray(response) ? response.join(' | ') : response

  if (!success) response = `❗ Error while executing ➡ ` + response

  if (type === MessageType.MESSAGE) return sendMessage(where, response)

  if (type === MessageType.WHISPER) return sendWhisper(where, response)
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
