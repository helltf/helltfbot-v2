import { DisableCommand } from '@src/commands/cmd/disable'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleChannel,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('disable', () => {
  let disable: DisableCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb()
    disable = new DisableCommand()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('channel is already disabled return no success', async () => {
      jest.spyOn(disable.methods, 'disable').mockResolvedValue(false)
      const { response, success } = await disable.execute({
        user,
        channel,
        params: {}
      })

      expect(response).toBe('Bot is already disabled')
      expect(success).toBe(false)
    })

    it('bot is not disabled return success', async () => {
      jest.spyOn(disable.methods, 'disable').mockResolvedValue(true)
      const { response, success } = await disable.execute({
        user,
        channel,
        params: {}
      })

      expect(response).toBe('disabled')
      expect(success).toBe(true)
    })
  })

  describe('disable method', () => {
    const channel = 'channel'

    it('channel is already disabled return false', async () => {
      const savedChannel = getExampleChannel({ channel, allowed: false })
      await hb.db.channel.save(savedChannel)

      const success = await disable.methods.disable(channel)

      expect(success).toBe(false)
    })

    it('channel is allowed return true and update entity', async () => {
      const savedChannel = getExampleChannel({ channel, allowed: true })
      await hb.db.channel.save(savedChannel)

      const success = await disable.methods.disable(channel)

      expect(success).toBe(true)

      const updatedEntity = await hb.db.channel.findOneBy({ channel })

      expect(updatedEntity?.allowed).toBe(false)
    })
  })
})
