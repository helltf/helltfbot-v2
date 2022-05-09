import { ChatUserstate } from 'tmi.js'

export async function saveUserStateAsUser(user: ChatUserstate) {
  await hb.db.userRepo.save({
    color: user.color,
    display_name: user['display-name'],
    id: parseInt(user['user-id']),
    name: user.username,
    notifications: [],
    suggestions: [],
    permission: 0,
    registered_at: 1
  })
}
