import { mainJoinAllChannels } from './join.js'

export const handleConnect = async () => {
  await mainJoinAllChannels()

  const startUpMessage = process.env.START_UP_MESSAGE

  if (!startUpMessage) return
  hb.sendMessage(process.env.MAIN_USER, startUpMessage)
}
