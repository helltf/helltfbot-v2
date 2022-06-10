import { Badges } from 'tmi.js'

import { PermissionLevel } from '@utilities/twitch/types'
import { Permission } from '@src/utilities/twitch/permission'

describe('test mapping of permissions', () => {
  let permission: Permission

  beforeEach(() => {
    permission = new Permission()
  })

  it('normal user has permissions of 0', () => {
    const badges: Badges = {}
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.USER)
  })

  it('subscriber user has permissions of 1', () => {
    const badges: Badges = {
      subscriber: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.SUB)
  })

  it('founder user has permissions of 1', () => {
    const badges: Badges = {
      founder: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.SUB)
  })

  it('vip user has permissions of 2', () => {
    const badges: Badges = {
      vip: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.VIP)
  })

  it('moderator user has permissions of 3', () => {
    const badges: Badges = {
      moderator: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.MOD)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      broadcaster: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.BROADCASTER)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      moderator: '0',
      subscriber: '0',
      broadcaster: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(PermissionLevel.BROADCASTER)
  })
})

describe('return correct permission', () => {
  let permission: Permission

  beforeEach(() => {
    permission = new Permission()
  })

  it('chat perm is heigher returning chat perm', () => {
    const dbPerm = PermissionLevel.USER
    const chatPerm = PermissionLevel.SUB

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })

  it('db perm is heigher returning db perm', () => {
    const dbPerm = PermissionLevel.DEV
    const chatPerm = PermissionLevel.SUB

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(dbPerm)
  })
  it('db perm is the same returning chat perm', () => {
    const dbPerm = PermissionLevel.MOD
    const chatPerm = PermissionLevel.MOD

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })

  it('user is user but blocked return -PermissionLevel.SUB as permissions', () => {
    const dbPerm = PermissionLevel.BLOCKED
    const chatPerm = PermissionLevel.USER

    const resultingLevel = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(resultingLevel).toBe(PermissionLevel.BLOCKED)
  })

  it('user is mod but blocked return -PermissionLevel.SUB as permissions', () => {
    const dbPerm = PermissionLevel.BLOCKED
    const chatPerm = PermissionLevel.MOD

    const resultingLevel = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(resultingLevel).toBe(PermissionLevel.BLOCKED)
  })
})
