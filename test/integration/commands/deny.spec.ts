import { DenyCommand } from "@src/commands/cmd/deny"
import { SuggestionStatus } from "@src/db/entities/suggestion.entity"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('deny', () => {
  let deny: DenyCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb()
    deny = new DenyCommand()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('id does not exist return error', async () => {
      const id = '1'

      jest.spyOn(deny.methods, 'updateSuggestion').mockResolvedValue(false)
      const { response, success } = await deny.execute({
        channel,
        user,
        params: {
          id
        }
      })

      expect(response).toBe('suggestion does not exist')
      expect(success).toBe(false)

      expect(deny.methods.updateSuggestion).toHaveBeenCalled()
    })

    it('suggestion does exist invoke update function', async () => {
      const id = '1'

      jest.spyOn(deny.methods, 'updateSuggestion').mockResolvedValue(true)
      const { response, success } = await deny.execute({
        params: {
          id
        },
        user,
        channel
      })

      expect(response).toBe(`Successfully updated suggestion with id ${id}`)
      expect(success).toBe(true)
      expect(deny.methods.updateSuggestion).toHaveBeenCalled()
    })

    it('suggestion gets updated send notification', async () => {
      const id = '1'

      jest.spyOn(deny.methods, 'updateSuggestion').mockResolvedValue(true)
      jest.spyOn(deny.methods, 'sendNotification').mockImplementation(jest.fn())
      await deny.execute({
        user,
        channel,
        params: {
          id
        }
      })
      expect(deny.methods.sendNotification).toHaveBeenCalledWith(id)
    })
  })

  describe('udpate suggestion', () => {
    const id = '1'
    const reason = 'reason'
    const user = getExampleTwitchUserEntity({})
    const channel = 'channel'

    it('id does not exist return false', async () => {
      const result = await deny.methods.updateSuggestion(id, reason)

      expect(result).toBe(false)
    })

    it('id does exist update status of entity to denied', async () => {
      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: Number(id),
        user: user,
        date: Date.now(),
        suggestion: 'something',
        channel
      })
      const result = await deny.methods.updateSuggestion(id, reason)

      expect(result).toBe(true)

      const updatedSuggestion = await hb.db.suggestion.findOneBy({
        id: Number(id)
      })

      expect(updatedSuggestion?.status).toBe(SuggestionStatus.DENIED)
      expect(updatedSuggestion?.reason).toBe(reason)
    })
  })

  describe('send notification', () => {
    it('send message to twitch chat with reason', async () => {
      const user = getExampleTwitchUserEntity({})
      const channel = 'channel'
      const id = '1'
      const reason = 'reason'

      jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: Number(id),
        user: user,
        date: Date.now(),
        suggestion: '',
        channel,
        reason
      })

      await deny.methods.sendNotification(id)

      expect(hb.sendMessage).toHaveBeenCalledWith(
        channel,
        `@${user.name} your suggestion with id ${id} has been denied with reason: ${reason}`
      )
    })
  })
})
