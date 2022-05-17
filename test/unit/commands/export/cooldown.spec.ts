import { TwitchUserState } from '../../../../client/types.js'
import { Cooldown } from '../../../../commands/export/cooldown.js'
import { Command } from '../../../../commands/export/types.js'
import { getExampleTwitchUserState } from '../../../../spec/examples/user.js'
import { getExampleCommand } from '../../../test-utils/example.js'

describe('testing cooldown class', () => {
  let cooldown: Cooldown
  let command: Command
  let user: TwitchUserState

  beforeEach(() => {
    cooldown = new Cooldown()
    command = getExampleCommand({
      cooldown: 5000
    })
    user = getExampleTwitchUserState({})
  })

  it('cooldowns should be empty by default', () => {
    const cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(0)
  })

  it('setting cooldown should add an entry in map', () => {
    cooldown.setCooldown(command, user['user-id'])

    const cooldownSize = getCooldownMapSize(cooldown)

    expect(cooldownSize).toBe(1)
  })

  it('setting cooldown should add an entry for user', () => {
    const userId = user['user-id']

    cooldown.setCooldown(command, userId)

    const entryForUser = cooldown.cooldowns.get(userId)
    const expectedCommand = command.name

    expect(entryForUser).toContain(expectedCommand)
  })

  it('user has no cooldown no entry', () => {
    const hasCooldown = cooldown.userHasCooldown(command, user['user-id'])
    expect(hasCooldown).toBeFalsy()
  })

  it('user has cooldown on command entry', () => {
    const userId = user['user-id']
    cooldown.setCooldown(command, userId)

    const hasCooldown = cooldown.userHasCooldown(command, userId)

    expect(hasCooldown).toBeTrue()
  })

  it('user has cooldown on different command, no cooldown expected', () => {
    const userId = user['user-id']
    const otherCommand = getExampleCommand({ name: 'other' })

    cooldown.setCooldown(command, userId)

    const hasCooldown = cooldown.userHasCooldown(otherCommand, userId)

    expect(hasCooldown).toBeFalse()
  })

  it('get cooldowns array should be empty be default', () => {
    const userId = user['user-id']
    const result = cooldown.getCooldownsForUser(userId)

    expect(result).toBeUndefined()
  })

  it('get cooldowns array should be 1 after creating entry', () => {
    const userId = user['user-id']
    cooldown.setCooldown(command, userId)
    const result = cooldown.getCooldownsForUser(userId)
    const expectedSize = 1

    expect(result).toHaveSize(expectedSize)
  })

  it('get cooldowns array should be 2 after creating 2 entries', () => {
    const userId = user['user-id']
    const otherCommand = getExampleCommand({ name: 'other' })

    cooldown.setCooldown(command, userId)
    cooldown.setCooldown(otherCommand, userId)

    const result = cooldown.getCooldownsForUser(userId)
    const expectedSize = 2

    expect(result).toHaveSize(expectedSize)
  })

  it('entry should be gone after cooldown is over', (done) => {
    const userId = user['user-id']

    cooldown.setCooldown(command, userId)

    setTimeout(() => {
      const entries = cooldown.userHasCooldown(command, userId)
      expect(entries).toBeFalse()
      done()
    }, command.cooldown)
  })

  it('entry should not be gone after cooldown is not fully over', (done) => {
    const userId = user['user-id']

    cooldown.setCooldown(command, userId)

    setTimeout(() => {
      const entries = cooldown.userHasCooldown(command, userId)
      expect(entries).toBeTrue()
      done()
    }, command.cooldown - command.cooldown / 2)
  })
})

function getCooldownMapSize(cooldown: Cooldown) {
  return cooldown.cooldowns.size
}
