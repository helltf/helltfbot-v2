import { Userstate, Badges } from 'tmi.js'

const getChatPermissions = (badges: Badges): number => {
  if (badges.broadcaster !== undefined) return 1
  if (badges.moderator !== undefined) return 2
  if (badges.vip !== undefined) return 3
  if (badges.subscriber !== undefined || badges.founder !== undefined) return 4
  return 5
}

const returnCorrectPermissions = (db: number, chat: number) => {
  return db < chat ? db : chat
}

const getUserPermissions = async (user: Userstate): Promise<number> => {
  const chatPermissions = getChatPermissions(user.badges)
  const dbPermissions = (
    await hb.db.userRepo.findOneBy({
      id: Number(user['user-id'])
    })
  )?.permission

  return returnCorrectPermissions(chatPermissions, dbPermissions)
}

export { getChatPermissions, returnCorrectPermissions, getUserPermissions }
