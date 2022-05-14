import { Userstate, Badges } from 'tmi.js'
import { PermissionLevel } from './types.js'

const getChatPermissions = (badges: Badges): PermissionLevel => {
  if (badges.broadcaster !== undefined) return PermissionLevel.BROADCASTER
  if (badges.moderator !== undefined) return PermissionLevel.MOD
  if (badges.vip !== undefined) return PermissionLevel.VIP
  if (badges.subscriber !== undefined || badges.founder !== undefined)
    return PermissionLevel.SUB
  return PermissionLevel.USER
}

const returnHigherPermsissions = (
  db: PermissionLevel,
  chat: PermissionLevel
): PermissionLevel => {
  return db > chat ? db : chat
}

const getUserPermissions = async (
  user: Userstate
): Promise<PermissionLevel> => {
  const chatPermissions = getChatPermissions(user.badges)
  const dbPermissions = (
    await hb.db.userRepo.findOneBy({
      id: Number(user['user-id'])
    })
  )?.permission

  return returnHigherPermsissions(chatPermissions, dbPermissions)
}

export { getChatPermissions, returnHigherPermsissions, getUserPermissions }
