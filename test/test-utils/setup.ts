import { TwitchBot } from '../../src/client/bot.js'

export const setup = () => {
  globalThis.hb = new TwitchBot()
}
