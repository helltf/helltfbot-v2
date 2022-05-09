import { ChatUserstate } from 'tmi.js'
import { Cooldown } from '../../../../commands/export/cooldown.js'
import { Command } from '../../../../commands/export/types.js'
import { exampleCommand } from '../../../../spec/examples/command.js'
import { exampleUser } from '../../../../spec/examples/user.js'

describe('testing cooldown class', () => {
  let cooldown: Cooldown
  let command: Command
  let user: ChatUserstate

  beforeEach(() => {
    cooldown = new Cooldown()
    command = exampleCommand
    user = exampleUser
  })

  it('cooldowns should be empty by default', () => {
    let cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(0)
  })

  it('setting cooldown should add an entry in map', () => {
    cooldown.setCooldown(command, user['user-id'])

    let cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(1)
  })

  it('setting cooldown should add an entry for user', () => {
    let userId = user['user-id']

    cooldown.setCooldown(command, userId)

    let entryForUser = cooldown.cooldowns.get(userId)
    let expectedCommand = command.name

    expect(entryForUser).toContain(expectedCommand)
  })

  it('user has no cooldown no entry', () => {
    let hasCooldown = cooldown.userHasCooldown(command, user['user-id'])
    expect(hasCooldown).toBeFalsy()
  })

  it('user has cooldown on command entry', () => {
    let userId = user['user-id']
    cooldown.setCooldown(command, userId)

    let hasCooldown = cooldown.userHasCooldown(command, userId)

    expect(hasCooldown).toBeTrue()
  })

  it('user has cooldown on different command, no cooldown expected', () => {
    let userId = user['user-id']
    let otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId)

    let hasCooldown = cooldown.userHasCooldown(otherCommand, userId)

    expect(hasCooldown).toBeFalse()
  })

  it('get cooldowns array should be empty be default', () => {
    let userId = user['user-id']
    let result = cooldown.getCooldownsForUser(userId)

    expect(result).toBeUndefined()
  })

  it('get cooldowns array should be 1 after creating entry', () => {
    let userId = user['user-id']
    cooldown.setCooldown(command, userId)
    let result = cooldown.getCooldownsForUser(userId)
    let expectedSize = 1

    expect(result).toHaveSize(expectedSize)
  })

  it('get cooldowns array should be 2 after creating 2 entries', () => {
    let userId = user['user-id']
    let otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId)
    cooldown.setCooldown(otherCommand, userId)

    let result = cooldown.getCooldownsForUser(userId)
    let expectedSize = 2

    expect(result).toHaveSize(expectedSize)
  })

  it('entry should be gone after cooldown is over', (done) => {
    let userId = user['user-id']

    cooldown.setCooldown(command, userId)

    setTimeout(() => {
      let entries = cooldown.userHasCooldown(command, userId)
      expect(entries).toBeFalse()
      done()
    }, command.cooldown)
  })

  it('entry should not be gone after cooldown is not fully over', (done) => {
    let userId = user['user-id']

    cooldown.setCooldown(command, userId)

    setTimeout(() => {
      let entries = cooldown.userHasCooldown(command, userId)
      expect(entries).toBeTrue()
      done()
    }, command.cooldown - command.cooldown / 2)
  })
})

function getCooldownMapSize(cooldown: Cooldown) {
  return cooldown.cooldowns.size
}

function createOtherCommand(name: string): Command {
  let obj = Object.assign({}, exampleCommand)
  obj.name = name
  return obj
}
