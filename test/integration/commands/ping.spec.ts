import { ResourceError, ResourceSuccess } from "@api/types"
import { PingCommand } from "@commands/cmd/ping"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
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
    const commit = `master@1 v1.3.1`
    spyOn(ping.methods, 'getUptime').and.returnValue(uptime)
    spyOn(ping.methods, 'getMemory').and.returnValue(memoryUsage)
    spyOn(ping.methods, 'getCommandsIssued').and.resolveTo(commandsIssued)
    spyOn(ping.methods, 'getChannels').and.resolveTo(joinedChannels)
    spyOn(ping.methods, 'getLatency').and.resolveTo(latency)
    spyOn(ping.methods, 'getCommitInfo').and.resolveTo(commit)

    const { success, response } = await ping.execute()

    const expectedResponse = [
      `pong`,
      `Latency: ${latency}ms`,
      `Uptime: ${uptime}`,
      `Memory used: ${memoryUsage}`,
      `Commit: ${commit}`,
      `Commands issued: ${commandsIssued}`,
      `Joined ${joinedChannels} channels`
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

  describe('commit info', () => {
    it('get commit info returns branch with commit ref and tags', async () => {
      const branch = 'main'
      const commit = '124535'
      const tag = 'v1.3.2'

      spyOn(ping.methods, 'getCurrentBranch').and.resolveTo(branch)
      spyOn(ping.methods, 'getTag').and.resolveTo(tag)
      spyOn(ping.methods, 'getRev').and.resolveTo(commit)

      const result = await ping.methods.getCommitInfo()
      const expectedResult = `${branch}@${commit} ${tag}`

      expect(result).toBe(expectedResult)
    })

    it('get branch returns current branch', async () => {
      const branch = 'master'
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceSuccess(branch))

      const result = await ping.methods.getCurrentBranch()

      expect(result).toBe(branch)
    })

    it('get branch failes return no-branch', async () => {
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceError('error'))

      const result = await ping.methods.getCurrentBranch()

      expect(result).toBe('no-branch')
    })

    it('get rev returns short rev', async () => {
      const rev = 'abcdefg'
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceSuccess(rev))

      const result = await ping.methods.getRev()

      expect(result).toBe(rev)
    })

    it('get rev failes returns no-rev', async () => {
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceError('error'))

      const result = await ping.methods.getRev()

      expect(result).toBe('no-rev')
    })

    it('get tag returns tag', async () => {
      const tag = 'v1.3.1'
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceSuccess(tag))

      const result = await ping.methods.getTag()

      expect(result).toBe(tag)
    })

    it('get tag failes returns no-tag', async () => {
      spyOn(hb.utils, 'exec').and.resolveTo(new ResourceError('error'))

      const result = await ping.methods.getTag()

      expect(result).toBe('no-tag')
    })
  })
})