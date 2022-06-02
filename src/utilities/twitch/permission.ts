import { Userstate, Badges } from 'tmi.js'
import { PermissionLevel } from './types.js'

export const getChatPermissions = (badges: Badges): PermissionLevel => {
  if (badges.broadcaster !== undefined) return PermissionLevel.BROADCASTER
  if (badges.moderator !== undefined) return PermissionLevel.MOD
  if (badges.vip !== undefined) return PermissionLevel.VIP
  if (badges.subscriber !== undefined || badges.founder !== undefined)
    return PermissionLevel.SUB
  return PermissionLevel.USER
}

export const returnHigherPermissions = (
  db: PermissionLevel,
  chat: PermissionLevel
): PermissionLevel => {
  if (db === PermissionLevel.BLOCKED) return db
  return db > chat ? db : chat
}

export const getUserPermissions = async (
  user: Userstate
): Promise<PermissionLevel> => {
  const chatPermissions = getChatPermissions(user.badges!)
  const dbPermissions =
    (
      await hb.db.userRepo.findOneBy({
        id: Number(user['user-id'])
      })
    )?.permission ?? PermissionLevel.USER

  return returnHigherPermissions(chatPermissions, dbPermissions)
}
