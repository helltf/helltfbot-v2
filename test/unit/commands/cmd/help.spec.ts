import { HelpCommmand } from "@src/commands/cmd/help"
import {Command} from "@src/commands/types"
import { getExampleCommand, getExampleTwitchUserState } from "@test-utils/example"
import { setup } from '@test-utils/setup'

describe('help command', () => {
  let help: HelpCommmand
  const channel = ''
  const user = getExampleTwitchUserState({})

  beforeEach(() => {
    help = new HelpCommmand()
    setup()
  })

  it('no command given return error', async () => {
    const { response, success } = await help.execute({
      channel: channel,
      message: [],
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
    const message = ['unknown command']

    const { response, success } = await help.execute({
      channel,
      message,
      user
    })

    expect(success).toBe(false)
    expect(response).toBe('This command does not exist')
  })

  it('command does exist return information', async () => {
    const command = help
    const message = [command.name]

    const { response, success } = await help.execute({
      channel,
      message,
      user
    })

    const expectedResponse = [
      `Name: ${command.name}`,
      `Aliases: ${command.alias.join(',')}`,
      `Description: ${command.description}`,
      `Cooldown: ${command.cooldown / 1000}s`,
      `Permissions: ${hb.utils.permission.map(command.permissions)}`,
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
    const command: Command = getExampleCommand({
      alias: [],
      optionalParams: [],
      requiredParams: []
    })
    const message = ['testmessage']

    jest.spyOn(hb, 'getCommand').mockReturnValue(command)

    const { response, success } = await help.execute({
      channel,
      user,
      message
    })
    const expectedResponse = [
      `Name: ${command.name}`,
      `Description: ${command.description}`,
      `Cooldown: ${command.cooldown / 1000}s`,
      `Permissions: ${hb.utils.permission.map(command.permissions)}`
    ]

    expect(success).toBe(true)
    expect(response).toEqual(expectedResponse)
  })
})