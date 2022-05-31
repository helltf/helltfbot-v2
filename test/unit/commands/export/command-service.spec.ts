import { CommandService } from '../../../../src/commands/export/commands-service.js'
import { getExampleCommand } from '../../../test-utils/example.js'

describe('testing commands class', () => {
  it('input no command should have no command', () => {
    const commands = new CommandService([])

    expect(commands.commands).toHaveSize(0)
  })

  it('input one command should have one command', () => {
    const command = getExampleCommand({})
    const commands = new CommandService([command])

    expect(commands.commands).toHaveSize(1)
  })
  it('input one command should activate should have name and alias in activate', () => {
    const command = getExampleCommand({
      alias: ['a', 'b', 'c']
    })
    const commands = new CommandService([command])

    const activateForCommand = commands.commands[0].activate
    const expectedActivate = [command.name, ...command.alias]

    expect(activateForCommand).toEqual(expectedActivate)
  })
  it('input one command command info should be the same', () => {
    const command = getExampleCommand({})
    const commands = new CommandService([command])

    const savedCommand = commands.commands[0].command
    expect(savedCommand).toEqual(command)
  })

  it('find command input name return correct command', () => {
    const command = getExampleCommand({})
    const commands = new CommandService([command])

    const foundCommand = commands.findCommand(command.name)

    expect(foundCommand).toEqual(command)
  })
  it('find command input wrong name return undefined', () => {
    const command = getExampleCommand({})
    const commands = new CommandService([command])

    const foundCommand = commands.findCommand('wrong name')

    expect(foundCommand).toBeUndefined()
  })

  it('find command input alias from command return correct command', () => {
    const exampleAliases = ['a', 'b', 'c']
    const command = getExampleCommand({
      alias: exampleAliases
    })
    const commands = new CommandService([command])

    const foundCommand = commands.findCommand(exampleAliases[0])

    expect(foundCommand).toEqual(command)
  })

  it('find command input different alias from command return correct command', () => {
    const exampleAliases = ['a', 'b', 'c']
    const command = getExampleCommand({
      alias: exampleAliases
    })
    const commands = new CommandService([command])

    const foundCommand = commands.findCommand(exampleAliases[1])

    expect(foundCommand).toEqual(command)
  })

  it('command name is given two times throw error', () => {
    const name = 'name'
    const command1 = getExampleCommand({ name })
    const command2 = getExampleCommand({ name })
    const createCommands = () => {
      new CommandService([command1, command2])
    }
    expect(createCommands).toThrowError()
  })

  it('command alias is used already throw error', () => {
    const alias = ['a']

    const command1 = getExampleCommand({
      name: 'first',
      alias: alias
    })

    const command2 = getExampleCommand({
      name: 'second',
      alias: alias
    })

    const createCommands = () => {
      new CommandService([command1, command2])
    }

    expect(createCommands).toThrowError()
  })

  it('command name is already defined but given in alias throw error', () => {
    const command1 = getExampleCommand({
      name: 'first'
    })

    const command2 = getExampleCommand({
      name: 'second',
      alias: ['first']
    })

    const createCommands = () => {
      new CommandService([command1, command2])
    }

    expect(createCommands).toThrowError()
  })

  it('command alias is already defined but given in name throw error', () => {
    const command1 = getExampleCommand({
      name: 'first',
      alias: ['second']
    })

    const command2 = getExampleCommand({
      name: 'second'
    })

    const createCommands = () => {
      new CommandService([command1, command2])
    }

    expect(createCommands).toThrowError()
  })

  it('commands contains 0 commands getAll returns empty array', () => {
    const commands = new CommandService([])

    const allCommands = commands.getAll()

    expect(allCommands).toHaveSize(0)
  })

  it('commands contains one command get all returns this command', () => {
    const exampleCommand = getExampleCommand({})
    const commands = new CommandService([exampleCommand])
    const allCommands = commands.getAll()

    const givenCommand = allCommands[0]

    expect(allCommands).toHaveSize(1)

    expect(givenCommand).toEqual(exampleCommand)
  })

  it('commands contains two commands get all returns both commands', () => {
    const command1 = getExampleCommand({ name: 'command1' })
    const command2 = getExampleCommand({ name: 'command2' })

    const commands = new CommandService([command1, command2])
    const allCommands = commands.getAll()

    expect(allCommands).toHaveSize(2)

    expect(allCommands).toContain(command1)
    expect(allCommands).toContain(command2)
  })
})
