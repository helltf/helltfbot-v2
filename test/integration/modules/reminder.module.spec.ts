import { ReminderModule } from '@modules/reminder.module'

describe('reminder module', () => {
  let module: ReminderModule

  beforeEach(() => {
    module = new ReminderModule()
  })

  describe('initialize', () => {
    it('invoke starts event listener', () => {
      jest.spyOn(hb.client, 'addListener')

      expect(hb.client.addListener).toHaveBeenCalled()
    })
  })
})
