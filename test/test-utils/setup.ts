import { TwitchBot } from '../../src/client/bot'

export const setup = () => {
  globalThis.hb = new TwitchBot()
}
