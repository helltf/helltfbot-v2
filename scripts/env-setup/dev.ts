import { ColorHistory, Suggestion } from "../../src/db/export-entities.js"
import { PermissionLevel } from "../../src/utilities/twitch/types.js"

export const setupDev = async () => {
  const user = hb.config.get('MAIN_USER')

  if (!user) return

  await permitMainUser(user)
  await addMainUserChannel(user)
}

async function permitMainUser(user: string) {
  const user_id = hb.config.get('MAIN_USER_ID')

  if (!user_id) return

  await hb.db.userRepo.save({
    color: '',
    display_name: user,
    id: Number(user_id),
    name: user,
    permission: PermissionLevel.ADMIN,
    suggestions: [] as Suggestion[],
    colors: {} as ColorHistory,
    notifications: [],
    registered_at: Date.now()
  })
}

const addMainUserChannel = async (user: string) => {
  const existing = await hb.db.channelRepo.findOneBy({
    channel: user
  })

  if (existing) return

  await hb.db.channelRepo.save({
    allowed: true,
    allowed_live: true,
    channel: user,
    connect_timestamp: Date.now(),
    joined: true,
    times_connected: 1
  })

  await hb.client.join(user)
}