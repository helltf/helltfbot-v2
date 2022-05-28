import { TwitchUserState } from '../../../../src/client/types.js'
import { Cooldown } from '../../../../src/commands/export/cooldown.js'
import { Command } from '../../../../src/commands/export/types.js'
import { getExampleCommand, getExampleTwitchUserState } from '../../../test-utils/example.js'

describe('testing cooldown class', () => {
  let cooldown: Cooldown
  let command: Command
  let user: TwitchUserState

  afterEach(function () {
    jasmine.clock().uninstall();
  });


  beforeEach(() => {
    cooldown = new Cooldown()
    command = getExampleCommand({})
    user = getExampleTwitchUserState({})
    jasmine.clock().install();
  })

  it('cooldowns should be empty by default', () => {
    const cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(0)
  })

  it('setting cooldown should add an entry in map', () => {
    cooldown.setCooldown(command, user['user-id']!)

    const cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(1)
  })

  it('setting cooldown should add an entry for user', () => {
    const userId = user['user-id']!

    cooldown.setCooldown(command, userId)

    const entryForUser = cooldown.cooldowns.get(userId)
    const expectedCommand = command.name

    expect(entryForUser).toContain(expectedCommand)
  })

  it('user has no cooldown no entry', () => {
    const hasCooldown = cooldown.userHasCooldown(command, user['user-id']!)
    expect(hasCooldown).toBeFalsy()
  })

  it('user has cooldown on command entry', () => {
    const userId = user['user-id']!
    cooldown.setCooldown(command, userId)

    const hasCooldown = cooldown.userHasCooldown(command, userId)

    expect(hasCooldown).toBeTrue()
  })

  it('user has cooldown on different command, no cooldown expected', () => {
    const userId = user['user-id']!
    const otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId!)

    const hasCooldown = cooldown.userHasCooldown(otherCommand, userId!)

    expect(hasCooldown).toBeFalse()
  })

  it('get cooldowns array should be empty be default', () => {
    const userId = user['user-id']!
    const result = cooldown.getCooldownsForUser(userId!)

    expect(result).toBeUndefined()
  })

  it('get cooldowns array should be 1 after creating entry', () => {
    const userId = user['user-id']!
    cooldown.setCooldown(command, userId)
    const result = cooldown.getCooldownsForUser(userId)
    const expectedSize = 1

    expect(result).toHaveSize(expectedSize)
  })

  it('get cooldowns array should be 2 after creating 2 entries', () => {
    const userId = user['user-id']!
    const otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId)
    cooldown.setCooldown(otherCommand, userId)

    const result = cooldown.getCooldownsForUser(userId)
    const expectedSize = 2

    expect(result).toHaveSize(expectedSize)
  })

  it('entry should be gone after cooldown is over', () => {
    const userId = user['user-id']!

    cooldown.setCooldown(command, userId)

    let userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBeTrue()

    jasmine.clock().tick(command.cooldown)

    userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBeFalse()
  })

  it('entry should not be gone after cooldown is not fully over', () => {
    const userId = user['user-id']!

    cooldown.setCooldown(command, userId)

    jasmine.clock().tick(command.cooldown - command.cooldown / 2)

    const userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBeTrue()
  })
})

function getCooldownMapSize(cooldown: Cooldown) {
  return cooldown.cooldowns.size
}

function createOtherCommand(name: string): Command {
  return getExampleCommand({ name })
}
