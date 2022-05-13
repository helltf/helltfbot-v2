import { Commands } from '../../../../commands/export/types.js'
import { getExampleCommand } from '../../../test-utils/example.js'

fdescribe('testing commands class', () => {
  it('input no command should have no command', () => {
    const commands = new Commands([])

    expect(commands.commands).toHaveSize(0)
  })

  it('input one command should have one command', () => {
    const command = getExampleCommand({})
    const commands = new Commands([command])

    expect(commands.commands).toHaveSize(1)
  })
  it('input one command should activate should have name and alias in activate', () => {
    const command = getExampleCommand({
      alias: ['a', 'b', 'c']
    })
    const commands = new Commands([command])

    const activateForCommand = commands.commands[0].activate
    const expectedActivate = [command.name, ...command.alias]

    expect(activateForCommand).toEqual(expectedActivate)
  })
  it('input one command command info should be the same', () => {
    const command = getExampleCommand({})
    const commands = new Commands([command])

    const savedCommand = commands.commands[0].command
    expect(savedCommand).toEqual(command)
  })

  it('find command input name return correct command', () => {
    const command = getExampleCommand({})
    const commands = new Commands([command])

    const foundCommand = commands.findCommand(command.name)

    expect(foundCommand).toEqual(command)
  })
  it('find command input wrong name return undefined', () => {
    const command = getExampleCommand({})
    const commands = new Commands([command])

    const foundCommand = commands.findCommand('wrong name')

    expect(foundCommand).toBeUndefined()
  })

  it('find command input alias from command return correct command', () => {
    const exampleAliases = ['a', 'b', 'c']
    const command = getExampleCommand({
      alias: exampleAliases
    })
    const commands = new Commands([command])

    const foundCommand = commands.findCommand(exampleAliases[0])

    expect(foundCommand).toEqual(command)
  })

  it('find command input different alias from command return correct command', () => {
    const exampleAliases = ['a', 'b', 'c']
    const command = getExampleCommand({
      alias: exampleAliases
    })
    const commands = new Commands([command])

    const foundCommand = commands.findCommand(exampleAliases[1])

    expect(foundCommand).toEqual(command)
  })

  it('command name is given two times throw error', () => {
    const name = 'name'
    const command1 = getExampleCommand({ name })
    const command2 = getExampleCommand({ name })
    const createCommands = () => {
      new Commands([command1, command2])
    }
    expect(createCommands).toThrowError()
  })
})
