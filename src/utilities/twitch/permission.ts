import { Userstate, Badges } from 'tmi.js'
import { PermissionLevel } from './types'


export class Permission {
  getChatPermissions = (badges: Badges): PermissionLevel => {
    if (badges.broadcaster !== undefined) return PermissionLevel.BROADCASTER
    if (badges.moderator !== undefined) return PermissionLevel.MOD
    if (badges.vip !== undefined) return PermissionLevel.VIP
    if (badges.subscriber !== undefined || badges.founder !== undefined)
      return PermissionLevel.SUB
    return PermissionLevel.USER
  }

  returnHigherPermissions = (
    db: PermissionLevel,
    chat: PermissionLevel
  ): PermissionLevel => {
    if (db === PermissionLevel.BLOCKED) return db
    return db > chat ? db : chat
  }

  async getDbPermissions(id: number): Promise<PermissionLevel> {
    return (
      (
        await hb.db.userRepo.findOneBy({
          id: id
        })
      )?.permission ?? PermissionLevel.USER
    )
  }

  get = async (user: Userstate): Promise<PermissionLevel> => {
    const chatPermissions = this.getChatPermissions(user.badges!)
    const dbPermissions = await this.getDbPermissions(Number(user['user-id']))

    return this.returnHigherPermissions(chatPermissions, dbPermissions)
  }
}