import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/utilities/permission/types'
import { Userstate, Badges } from 'tmi.js'


export class Permission {
  getChatPermissions = (badges: Badges): ChatPermissionLevel => {
    if (badges?.broadcaster !== undefined)
      return ChatPermissionLevel.BROADCASTER
    if (badges?.moderator !== undefined) return ChatPermissionLevel.MOD
    if (badges?.vip !== undefined) return ChatPermissionLevel.VIP
    if (badges?.subscriber !== undefined || badges.founder !== undefined)
      return ChatPermissionLevel.SUB
    return ChatPermissionLevel.USER
  }

  returnHigherPermissions = (
    db: GlobalPermissionLevel,
    chat: ChatPermissionLevel
  ): ChatPermissionLevel | GlobalPermissionLevel => {
    if (db === GlobalPermissionLevel.BLOCKED) return db
    return db > chat ? db : chat
  }

  async getDbPermissions(id: number): Promise<GlobalPermissionLevel> {
    return (
      (
        await hb.db.userRepo.findOneBy({
          id: id
        })
      )?.permission ?? GlobalPermissionLevel.USER
    )
  }

  get = async (
    user: Userstate
  ): Promise<ChatPermissionLevel | GlobalPermissionLevel> => {
    const chatPermissions = this.getChatPermissions(user.badges!)
    const dbPermissions = await this.getDbPermissions(Number(user['user-id']))

    return this.returnHigherPermissions(dbPermissions, chatPermissions)
  }

  map(level: ChatPermissionLevel | GlobalPermissionLevel): string | undefined {
    if (ChatPermissionLevel[level])
      return ChatPermissionLevel[level].toLowerCase()
    if (GlobalPermissionLevel[level])
      return GlobalPermissionLevel[level].toLowerCase()
  }
}