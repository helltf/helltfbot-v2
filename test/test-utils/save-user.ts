import { TwitchUserState } from '../../src/client/types.js'

export async function saveUserStateAsUser(user: TwitchUserState) {
  await hb.db.userRepo.save({
    color: user.color,
    display_name: user['display-name'],
    id: parseInt(user['user-id']!),
    name: user.username,
    notifications: [],
    suggestions: [],
    permission: user.permission,
    registered_at: 1
  })
}
