import { ResourceError } from '@api/types'
import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { wait } from '@src/utilities/wait'
import { ChatUserstate } from 'tmi.js'
import { Command, MessageType } from '../../commands/types'
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

export async function runCommand({
  message,
  self,
  type,
  user,
  where
}: ChatContext) {
  if (self) return

  if (!hasPrefix(message)) return

  const [commandLookup, ...data] = getMessageInfo(message)
  const contextMessage = data

  const command = hb.getCommand(commandLookup)

  if (!command) return

  if (userHasCooldown(command, user)) return

  user.permission = await hb.utils.permission.get(user)

  const evalResult = command.evaluate({
    message: contextMessage,
    type: type
  })

  if (evalResult instanceof ResourceError) {
    return sendResponse({
      response: { response: evalResult.error, success: false },
      type: type,
      where: where
    })
  }

  const context = command.buildContext({
    message: contextMessage,
    type,
    user,
    where
  })

  setCooldown(command, user)

  if (context instanceof ResourceError) {
    return sendResponse({
      where,
      type,
      response: { response: context.error, success: true }
    })
  }

  const response = await command.execute(context.data)

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
  await hb.db.command.increment(
    {
      name: command.name
    },
    'counter',
    1
  )
}

export { handleChat }
