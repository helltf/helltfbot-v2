import { TwitchBot } from '@client/bot'

export const setup = () => {
  globalThis.hb = new TwitchBot()
}
