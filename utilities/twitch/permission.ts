import { Userstate, Badges } from 'tmi.js'

const getChatPermissions = (badges: Badges): number => {
  if (badges.broadcaster !== undefined) return 4
  if (badges.moderator !== undefined) return 3
  if (badges.vip !== undefined) return 2
  if (badges.subscriber !== undefined || badges.founder !== undefined) return 1
  return 0
}

const returnLowerPermsissions = (db: number, chat: number) => {
  return db < chat ? db : chat
}

const getUserPermissions = async (user: Userstate): Promise<number> => {
  const chatPermissions = getChatPermissions(user.badges)
  const dbPermissions = (
    await hb.db.userRepo.findOneBy({
      id: Number(user['user-id'])
    })
  )?.permission

  return returnLowerPermsissions(chatPermissions, dbPermissions)
}

export { getChatPermissions, returnLowerPermsissions, getUserPermissions }
