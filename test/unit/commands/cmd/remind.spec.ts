import { ResourceError, ResourceSuccess } from "@api/types"
import { RemindCommand } from "@src/commands/cmd/remind"
import {
  getExampleReminderEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('remind command', () => {
  let remind: RemindCommand

  beforeEach(() => {
    setup()
    remind = new RemindCommand()
  })

  describe('execute', () => {
    const creator = getExampleTwitchUserState({})
    const reciever = 'reciever'
    const message = 'message'
    const channel = 'channel'

    it('creating reminder fails return error message', async () => {
      const error = 'Error'
      jest
        .spyOn(hb.reminder, 'create')
        .mockResolvedValue(new ResourceError(error))

      const { response, success } = await remind.execute({
        user: creator,
        channel,
        params: {
          user: reciever,
          message
        }
      })

      expect(response).toBe(error)
      expect(success).toBe(false)
    })

    it('creating reminder is successful return success message', async () => {
      const createdReminder = getExampleReminderEntity({})
      jest
        .spyOn(hb.reminder, 'create')
        .mockResolvedValue(new ResourceSuccess(createdReminder))

      const { response, success } = await remind.execute({
        user: creator,
        channel,
        params: {
          user: reciever,
          message
        }
      })

      const expectedResponse = `Successfully created your reminder with the id ${createdReminder.id}`

      expect(response).toBe(expectedResponse)
      expect(success).toBe(true)
    })
  })
})
