import { PingCommand } from "@commands/cmd/ping"

describe('test ping command', () => {
  let ping: PingCommand

  beforeEach(() => {
    ping = new PingCommand()
  })

  it('return success message', async () => {
    const { success, response } = await ping.execute()

    expect(success).toBeTrue()
    expect(response).toBe('pong')
  })
})