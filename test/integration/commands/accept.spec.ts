import { TwitchUserState } from "@src/client/types"
import { AcceptCommand } from "@src/commands/cmd/accept"
import { ReminderType } from "@src/db/entities/reminder.entity"
import { SuggestionStatus } from '@src/db/entities/suggestion.entity'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('accept command', () => {
  let user: TwitchUserState
  let accept: AcceptCommand
  const channel = 'messageChannel'

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    accept = new AcceptCommand()
    await clearDb(hb.db.dataSource)
    user = getExampleTwitchUserState({})
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    it('id is not defined return error response', async () => {
      const { response, success } = await accept.execute({
        channel: channel,
        message: [],
        user: user
      })

      expect(response).toBe('id missing')
      expect(success).toBe(false)
    })

    it('id does not exist return error response', async () => {
      const id = 1

      const { response, success } = await accept.execute({
        channel: channel,
        message: [`${id}`],
        user: user
      })

      expect(response).toBe('suggestion does not exist')
      expect(success).toBe(false)
    })

    it('update suggestion is successful return success', async () => {
      jest.spyOn(accept.methods, 'updateSuggestion').mockResolvedValue(true)
      jest
        .spyOn(accept.methods, 'createNotificationReminder')
        .mockImplementation(jest.fn())

      const id = 1

      const { response, success } = await accept.execute({
        channel: channel,
        message: [`${id}`],
        user: user
      })

      expect(response).toBe('Updated suggestion')
      expect(success).toBe(true)
    })

    it('update suggestion returns true send user notification', async () => {
      const id = '1'
      jest
        .spyOn(accept.methods, 'createNotificationReminder')
        .mockImplementation(jest.fn())
      jest.spyOn(accept.methods, 'updateSuggestion').mockResolvedValue(true)

      await accept.execute({ channel, message: [id], user })

      expect(accept.methods.createNotificationReminder).toHaveBeenCalled()
    })
  })

  describe('update suggestion', () => {
    it('no suggestion existing return false', async () => {
      const id = 1

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(false)
    })

    it('suggestion existing return true', async () => {
      const id = 1
      const user = getExampleTwitchUserEntity({})

      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: id,
        date: Date.now(),
        suggestion: '',
        user: user,
        channel: channel
      })

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(true)
    })

    it('multiple suggestions existing update correct', async () => {
      const id = 1
      const user = getExampleTwitchUserEntity({})

      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: id,
        date: Date.now(),
        suggestion: '',
        user: user,
        channel
      })

      await hb.db.suggestion.save({
        id: id + 1,
        date: Date.now(),
        suggestion: '',
        user: user,
        channel
      })

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(true)

      const updatedEntity = await hb.db.suggestion.findOneBy({ id: id })

      expect(updatedEntity?.status).toBe(SuggestionStatus.ACCEPTED)
    })
  })

  describe('create notification', () => {
    it('create reminder from info for suggestion', async () => {
      const id = '1'
      const suggestionCreator = getExampleTwitchUserEntity({})

      await hb.db.user.save(suggestionCreator)
      await hb.db.suggestion.save({
        id: Number(id),
        date: Date.now(),
        suggestion: '',
        suggestionCreator,
        channel,
        user: suggestionCreator
      })

      await accept.methods.createNotificationReminder(id)

      const reminders = await hb.db.reminder.find()

      expect(reminders).toHaveLength(1)
      expect(reminders[0].message).toBe(
        `@${suggestionCreator.name} your suggestion with id ${id} has been accepted`
      )
      expect(reminders[0].type).toBe(ReminderType.SYSTEM)
    })
  })
})
