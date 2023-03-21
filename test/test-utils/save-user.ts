import { TwitchUserState } from '@client/types'
import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/services/permissions.service'

export async function saveUserStateAsUser(user: TwitchUserState) {
  let permission: GlobalPermissionLevel

  if (!user.permission || user.permission in ChatPermissionLevel) {
    permission = GlobalPermissionLevel.USER
  } else {
    permission = user.permission as GlobalPermissionLevel
  }

  await hb.db.user.save({
    color: user.color,
    display_name: user['display-name'],
    id: parseInt(user['user-id']!),
    name: user.username,
    notifications: [],
    suggestions: [],
    permission: permission,
    registered_at: 1
  })
}
