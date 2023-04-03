import { BaseCommand } from "@src/commands/base"
import { HelpCommmand } from "@src/commands/cmd/help"
import {
  getExampleCommand,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setup } from '@test-utils/setup'

describe('help command', () => {
  let help: HelpCommmand
  const channel = ''
  const user = getExampleTwitchUserState({})

  beforeEach(() => {
    help = new HelpCommmand()
    setup()
  })

  it('no command given return info message', async () => {
    const { response, success } = await help.execute({
      channel: channel,
      params: {},
      user
    })
    const expectedResponse = [
      'Bot created by @helltf',
      'All commands are listed here https://github.com/helltf/helltfbot-v2/blob/master/Commands.md'
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })

  it('command does not exist return error', async () => {
    const { response, success } = await help.execute({
      channel,
      params: { command: 'unknown command' },
      user
    })

    expect(success).toBe(false)
    expect(response).toBe('This command does not exist')
  })

  it('command does exist return information', async () => {
    const command = help

    const { response, success } = await help.execute({
      channel,
      user,
      params: {
        command: command.name
      }
    })

    const expectedResponse = [
      `Name: ${command.name}`,
      `Aliases: ${command.alias.join(',')}`,
      `Description: ${command.description}`,
      `Cooldown: ${command.cooldown / 1000}s`,
      `Permissions: ${hb.permission.map(command.permissions)}`,
      ...(command.requiredParams.length
        ? [`Required params: ${command.requiredParams.join(',')}`]
        : []),
      ...(command.optionalParams.length
        ? [`Optional params: ${command.optionalParams.join(',')}`]
        : [])
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })

  it('command alias and params are empty do not return them', async () => {
    const command: BaseCommand = getExampleCommand({
      alias: [],
      optionalParams: [],
      requiredParams: []
    })

    jest.spyOn(hb, 'getCommand').mockReturnValue(command)

    const { response, success } = await help.execute({
      channel,
      user,
      params: {
        command: 'test'
      }
    })
    const expectedResponse = [
      `Name: ${command.name}`,
      `Description: ${command.description}`,
      `Cooldown: ${command.cooldown / 1000}s`,
      `Permissions: ${hb.permission.map(command.permissions)}`
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })
})
