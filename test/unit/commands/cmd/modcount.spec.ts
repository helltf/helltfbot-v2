import { ModCountCommand } from "@src/commands/cmd/modcount"
import { getExampleTwitchUserState } from "@test-utils/example"
import { setup } from "@test-utils/setup"

describe('mod count', () => {
  let modcount: ModCountCommand
  const user = getExampleTwitchUserState({})
  const channel = 'channel'

  beforeEach(() => {
    setup()
    modcount = new ModCountCommand()
  })

  describe('execute', () => {
    it('no channel defined return 1 mod count for current channel', async () => {
      const count = 1
      jest.spyOn(hb.client, 'mods').mockResolvedValue(Array(count))

      const { response, success } = await modcount.execute({
        channel,
        user,
        params: {}
      })

      expect(success).toBe(true)
      expect(response).toBe(`@${channel} has ${count} moderator`)
    })

    it('channel is defined return 2 mod count for given channel', async () => {
      const count = 2
      const givenChannel = 'givenChannel'
      jest.spyOn(hb.client, 'mods').mockResolvedValue(Array(count))

      const { response, success } = await modcount.execute({
        channel,
        user,
        params: { channel: givenChannel }
      })

      expect(success).toBe(true)
      expect(response).toBe(`@${givenChannel} has ${count} moderators`)
    })

    it('channel does not exist return error response', async () => {
      jest.spyOn(hb.client, 'mods').mockRejectedValue('error')

      const { response, success } = await modcount.execute({
        channel,
        user,
        params: {}
      })

      expect(success).toBe(false)
      expect(response).toBe('Could not get moderators of that channel')
    })
  })

  describe('get mod count', () => {
    it('request fails return error', async () => {
      jest.spyOn(hb.client, 'mods').mockRejectedValue('error')

      await modcount.methods.getModCount(channel)
    })

    it('mod is array is length 0 return 0', async () => {
      const length = 0

      jest.spyOn(hb.client, 'mods').mockResolvedValue(Array(length))

      const amount = await modcount.methods.getModCount(channel)

      expect(amount).toBe(length)
    })

    it('mod is array is length 1 return 1', async () => {
      const length = 1

      jest.spyOn(hb.client, 'mods').mockResolvedValue(Array(length))

      const amount = await modcount.methods.getModCount(channel)

      expect(amount).toBe(length)
    })
  })
})
