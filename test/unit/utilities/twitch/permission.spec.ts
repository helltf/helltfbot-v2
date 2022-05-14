import { Badges } from 'tmi.js'
import {
  getChatPermissions,
  returnHigherPermsissions
} from '../../../../utilities/twitch/permission.js'

describe('test mapping of permissions', () => {
  it('normal user has permissions of 0', () => {
    const badges: Badges = {}
    const result = getChatPermissions(badges)

    expect(result).toBe(0)
  })

  it('subscriber user has permissions of 1', () => {
    const badges: Badges = {
      subscriber: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(1)
  })

  it('founder user has permissions of 1', () => {
    const badges: Badges = {
      founder: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(1)
  })

  it('vip user has permissions of 2', () => {
    const badges: Badges = {
      vip: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(2)
  })

  it('moderator user has permissions of 3', () => {
    const badges: Badges = {
      moderator: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(3)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      broadcaster: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(4)
  })

  it('broadcaster user has permissions of 4', () => {
    const badges: Badges = {
      moderator: '0',
      subscriber: '0',
      broadcaster: '0'
    }
    const result = getChatPermissions(badges)

    expect(result).toBe(4)
  })
})

describe('return correct permission', () => {
  it('db perm is lower returning db perm', () => {
    const dbPerm = 0
    const chatPerm = 1

    const res = returnHigherPermsissions(dbPerm, chatPerm)

    expect(res).toBe(dbPerm)
  })

  it('db perm is heigher returning chat perm', () => {
    const dbPerm = 5
    const chatPerm = 1

    const res = returnHigherPermsissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })
  it('db perm is the same returning chat perm', () => {
    const dbPerm = 3
    const chatPerm = 3

    const res = returnHigherPermsissions(dbPerm, chatPerm)

    expect(res).toBe(chatPerm)
  })
})
