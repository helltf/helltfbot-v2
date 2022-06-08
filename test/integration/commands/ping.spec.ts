import { PingCommand } from "@commands/cmd/ping"

describe('test ping command', () => {
  let ping: PingCommand

  beforeEach(() => {
    ping = new PingCommand()
  })

  it('return success message', async () => {
    const channel = 'channel'
    const {
      channel: responseChannel,
      success,
      response
    } = await ping.execute(channel)

    expect(success).toBeTrue()
    expect(responseChannel).toBe(channel)
    expect(response).toBe('pong')
  })
})