import { TwitchUserState } from "@client/types"
import { Command } from "@commands/types"
import { Cooldown } from "@src/services/cooldown.service"
import {
  getExampleCommand,
  getExampleTwitchUserState
} from '@test-utils/example'

describe('testing cooldown class', () => {
  jest.useFakeTimers()
  let cooldown: Cooldown
  let command: Command
  let user: TwitchUserState

  beforeEach(() => {
    cooldown = new Cooldown()
    command = getExampleCommand({})
    user = getExampleTwitchUserState({})
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

    expect(hasCooldown).toBe(true)
  })

  it('user has cooldown on different command, no cooldown expected', () => {
    const userId = user['user-id']!
    const otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId!)

    const hasCooldown = cooldown.userHasCooldown(otherCommand, userId!)

    expect(hasCooldown).toBe(false)
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

    expect(result).toHaveLength(expectedSize)
  })

  it('get cooldowns array should be 2 after creating 2 entries', () => {
    const userId = user['user-id']!
    const otherCommand = createOtherCommand('other')

    cooldown.setCooldown(command, userId)
    cooldown.setCooldown(otherCommand, userId)

    const result = cooldown.getCooldownsForUser(userId)
    const expectedSize = 2

    expect(result).toHaveLength(expectedSize)
  })

  it('entry should be gone after cooldown is over', () => {
    const userId = user['user-id']!

    cooldown.setCooldown(command, userId)

    let userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBe(true)

    jest.advanceTimersByTime(command.cooldown)

    userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBe(false)
  })

  it('entry should not be gone after cooldown is not fully over', () => {
    const userId = user['user-id']!

    cooldown.setCooldown(command, userId)

    jest.advanceTimersByTime(command.cooldown - command.cooldown / 2)

    const userCooldown = cooldown.userHasCooldown(command, userId)

    expect(userCooldown).toBe(true)
  })
})

function getCooldownMapSize(cooldown: Cooldown) {
  return cooldown.cooldowns.size
}

function createOtherCommand(name: string): Command {
  return getExampleCommand({ name })
}
