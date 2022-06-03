import { mainJoinAllChannels } from './join.js'

export const handleConnect = async () => {
  await mainJoinAllChannels()

  const startUpMessage = hb.config.get('START_UP_MESSAGE')

  hb.sendMessage(hb.config.get('MAIN_USER'), startUpMessage)
}
