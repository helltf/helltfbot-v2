import { SuggestionEntity, ColorHistoryEntity } from "@db/entities"
import { GlobalPermissionLevel } from "@src/utilities/permission/types"

export const setupDev = async () => {
  const user = hb.config.get('MAIN_USER')
  const bot = hb.config.get('BOT_CHANNEL')

  if (!user || !bot) return

  await permitMainUser(user)
  await addBotUserChannel(bot)
}

async function permitMainUser(user: string) {
  const user_id = hb.config.get('MAIN_USER_ID')

  if (!user_id) return

  await hb.db.user.save({
    color: '',
    display_name: user,
    id: Number(user_id),
    name: user,
    permission: GlobalPermissionLevel.ADMIN,
    suggestions: [] as SuggestionEntity[],
    colors: {} as ColorHistoryEntity,
    notifications: [],
    registered_at: Date.now()
  })
}

const addBotUserChannel = async (user: string) => {
  const existing = await hb.db.channel.findOneBy({
    channel: user
  })

  if (existing) return

  await hb.db.channel.save({
    allowed: true,
    allowed_live: true,
    channel: user,
    connect_timestamp: Date.now(),
    joined: true,
    times_connected: 1
  })

  await hb.client.join(user)
}
