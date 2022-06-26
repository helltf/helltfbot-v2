import { PingCommand } from "@commands/cmd/ping"

fdescribe('test ping command', () => {
  let ping: PingCommand

  beforeEach(() => {
    ping = new PingCommand()
  })

  it('return success message', async () => {
    const uptime = '1s'

    spyOn(ping.methods, 'getUptime').and.returnValue(uptime)

    const { success, response } = await ping.execute()

    expect(success).toBeTrue()
    expect(response).toBe(`pong | Uptime: ${uptime}`)
  })
})