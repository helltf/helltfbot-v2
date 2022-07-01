import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { wait } from '@src/utilities/wait'
import { ChatUserstate } from 'tmi.js'
import { Command, CommandContext, MessageType } from '../../commands/types'
import { BotResponse, ChatContext, TwitchUserState } from '../types'

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

export const handleWhisper = (
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

async function runCommand({ where, user, message, self, type }: ChatContext) {
  if (self) return

  if (!message?.toLowerCase()?.startsWith(prefix)) return

  const [commandLookup, ...data] = getMessageInfo(message)
  const command = hb.getCommand(commandLookup)

  if (!command) return

  const context: CommandContext = {
    channel: where,
    message: data,
    type: type,
    user: user
  }

  user.permission = await hb.utils.permission.get(user)

  if (
    type === MessageType.WHISPER &&
    !command.flags.includes(MessageType.WHISPER)
  )
    return

  setCooldown(command, user)

  const response = await command.execute(context)

  incrementCommandCounter(command)

  sendResponse(where, response, type)
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

function sendResponse(
  where: string,
  { success, response }: BotResponse,
  type: MessageType
) {
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
