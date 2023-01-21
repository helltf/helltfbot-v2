import { ResourceError, ResourceSuccess } from "@api/types"
import { PingCommand } from "@commands/cmd/ping"
import { DB } from "@src/db/export-repositories"
import { Utility } from '@src/utilities/utility'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import { getExampleChannel, getExampleCommand } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'
import { Client } from 'tmi.js'

describe('test ping command', () => {
  let ping: PingCommand
  const db: DB = new DB()
  const utils = new Utility()
  const client = {} as Client

  beforeAll(async () => {
    await setupDatabase(db)
  })

  beforeEach(async () => {
    ping = new PingCommand(db, client, utils)
    await clearDb(db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase(db)
  })

  it('return success message', async () => {
    const uptime = '1s'
    const memoryUsage = '1MB'
    const commandsIssued = 400
    const joinedChannels = 1
    const latency = 190
    const commit = `master@1 v1.3.1`

    jest.spyOn(ping.methods, 'getUptime').mockReturnValue(uptime)
    jest.spyOn(ping.methods, 'getMemory').mockReturnValue(memoryUsage)
    jest
      .spyOn(ping.methods, 'getCommandsIssued')
      .mockResolvedValue(commandsIssued)
    jest.spyOn(ping.methods, 'getChannels').mockResolvedValue(joinedChannels)
    jest.spyOn(ping.methods, 'getLatency').mockResolvedValue(latency)
    jest.spyOn(ping.methods, 'getCommitInfo').mockResolvedValue(commit)

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
    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })

  it('get commands issued method returns all counter added up', async () => {
    const counter = 2
    const commands = ['cmd1', 'cmd2']

    for await (const cmd of commands) {
      await db.command.save({
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

    await db.channel.save(channel1)
    await db.channel.save(channel2)

    const amount = await ping.methods.getChannels()

    expect(amount).toBe(2)
  })

  describe('commit info', () => {
    it('get commit info returns branch with commit ref and tags', async () => {
      const branch = 'main'
      const commit = '124535'
      const tag = 'v1.3.2'
      const commitCount = '1000'

      jest.spyOn(ping.methods, 'getCurrentBranch').mockResolvedValue(branch)
      jest.spyOn(ping.methods, 'getTag').mockResolvedValue(tag)
      jest.spyOn(ping.methods, 'getRev').mockResolvedValue(commit)
      jest.spyOn(ping.methods, 'getCommitCount').mockResolvedValue(commitCount)

      const result = await ping.methods.getCommitInfo()
      const expectedResult = `${branch}@${commit} ${tag} with ${commitCount} commits`

      expect(result).toBe(expectedResult)
    })

    it('get branch returns current branch', async () => {
      const branch = 'master'
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceSuccess(branch))

      const result = await ping.methods.getCurrentBranch()

      expect(result).toBe(branch)
    })

    it('get branch failes return no-branch', async () => {
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceError('error'))

      const result = await ping.methods.getCurrentBranch()

      expect(result).toBe('no-branch')
    })

    it('get rev returns short rev', async () => {
      const rev = 'abcdefg'
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceSuccess(rev))

      const result = await ping.methods.getRev()

      expect(result).toBe(rev)
    })

    it('get rev failes returns no-rev', async () => {
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceError('error'))

      const result = await ping.methods.getRev()

      expect(result).toBe('no-rev')
    })

    it('get tag returns tag', async () => {
      const tag = 'v1.3.1'
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceSuccess(tag))

      const result = await ping.methods.getTag()

      expect(result).toBe(tag)
    })

    it('get tag failes returns no-tag', async () => {
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceError('error'))

      const result = await ping.methods.getTag()

      expect(result).toBe('no-tag')
    })

    it('get commit count returns tag', async () => {
      const amount = '1000'
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceSuccess(amount))

      const result = await ping.methods.getCommitCount()

      expect(result).toBe(amount)
    })

    it('get commit count failes returns no-tag', async () => {
      jest.spyOn(utils, 'exec').mockResolvedValue(new ResourceError('error'))

      const result = await ping.methods.getCommitCount()

      expect(result).toBe('no-commit-count')
    })
  })
})
