import { PingCommand } from "@commands/cmd/ping"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { getExampleChannel, getExampleCommand } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('test ping command', () => {
  let ping: PingCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    ping = new PingCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('return success message', async () => {
    const uptime = '1s'
    const memoryUsage = '1MB'
    const commandsIssued = 400
    const joinedChannels = 1
    const latency = 190

    spyOn(ping.methods, 'getUptime').and.returnValue(uptime)
    spyOn(ping.methods, 'getMemory').and.returnValue(memoryUsage)
    spyOn(ping.methods, 'getCommandsIssued').and.resolveTo(commandsIssued)
    spyOn(ping.methods, 'getChannels').and.resolveTo(joinedChannels)
    spyOn(ping.methods, 'getLatency').and.resolveTo(latency)

    const { success, response } = await ping.execute()

    const expectedResponse = [
      `pong`,
      `Latency: ${latency}ms`,
      `Uptime: ${uptime}`,
      `Memory used: ${memoryUsage}`,
      `Commands issued: ${commandsIssued}`,
      `Connected to ${joinedChannels} channels`
    ]
    expect(success).toBeTrue()
    expect(response).toEqual(expectedResponse)
  })

  it('get commands issued method returns all counter added up', async () => {
    const counter = 2
    const commands = ['cmd1', 'cmd2']

    for await (const cmd of commands) {
      await hb.db.command.save({
        ...getExampleCommand({
          name: cmd
        }),
        counter: counter
      })
    }

    const amount = await ping.methods.getCommandsIssued()

    expect(amount).toBe(counter * commands.length)
  })

  it('get channels function returns amount of channels with joined true', async () => {
    const channel1 = getExampleChannel({
      channel: 'channel1'
    })
    const channel2 = getExampleChannel({
      channel: 'channel2'
    })

    await hb.db.channel.save(channel1)
    await hb.db.channel.save(channel2)

    const amount = await ping.methods.getChannels()

    expect(amount).toBe(2)
  })
})