import { Badges } from 'tmi.js'

import { Permission } from '@src/utilities/permission/permission'
import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/services/permissions.service'

describe('test mapping of permissions', () => {
  let permission: Permission

  beforeEach(() => {
    permission = new Permission()
  })

  it('normal user has permissions of 0', () => {
    const badges: Badges = {}
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.USER)
  })

  it('subscriber user has permissions of 1', () => {
    const badges: Badges = {
      subscriber: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.SUB)
  })

  it('founder user has permissions of 1', () => {
    const badges: Badges = {
      founder: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.SUB)
  })

  it('vip user has permissions of 2', () => {
    const badges: Badges = {
      vip: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.VIP)
  })

  it('moderator user has permissions of 3', () => {
    const badges: Badges = {
      moderator: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.MOD)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      broadcaster: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.BROADCASTER)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      moderator: '0',
      subscriber: '0',
      broadcaster: '0'
    }
    const result = permission.getChatPermissions(badges)

    expect(result).toBe(ChatPermissionLevel.BROADCASTER)
  })
})

describe('return correct permission', () => {
  let permission: Permission

  beforeEach(() => {
    permission = new Permission()
  })

  it('chat perm is heigher returning chat perm', () => {
    const dbPerm = GlobalPermissionLevel.USER
    const chatPerm = ChatPermissionLevel.SUB

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })

  it('db perm is heigher returning db perm', () => {
    const dbPerm = GlobalPermissionLevel.DEV
    const chatPerm = ChatPermissionLevel.SUB

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(dbPerm)
  })
  it('db perm is the same returning chat perm', () => {
    const dbPerm = GlobalPermissionLevel.USER
    const chatPerm = ChatPermissionLevel.USER

    const res = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })

  it('user is user but blocked return blocked as permissions', () => {
    const dbPerm = GlobalPermissionLevel.BLOCKED
    const chatPerm = ChatPermissionLevel.USER

    const resultingLevel = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(resultingLevel).toBe(GlobalPermissionLevel.BLOCKED)
  })

  it('user is mod but blocked return blocked as permissions', () => {
    const dbPerm = GlobalPermissionLevel.BLOCKED
    const chatPerm = ChatPermissionLevel.MOD

    const resultingLevel = permission.returnHigherPermissions(dbPerm, chatPerm)

    expect(resultingLevel).toBe(GlobalPermissionLevel.BLOCKED)
  })
})
