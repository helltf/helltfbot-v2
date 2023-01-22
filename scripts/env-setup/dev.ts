import { SuggestionEntity, ColorHistoryEntity } from "@db/entities"
import { client } from "@src/client/main-client"
import { GlobalPermissionLevel } from "@src/utilities/permission/types"
import { getDeps } from 'deps'

const { db } = getDeps()

export const setupDev = async () => {
  const user = process.env.MAIN_USER
  const bot = process.env.BOT_CHANNEL

  if (!user || !bot) return

  await permitMainUser(user)
  await addBotUserChannel(bot)
}

async function permitMainUser(user: string) {
  const user_id = process.env.MAIN_USER_ID

  if (!user_id) return

  await db.user.save({
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
  const existing = await db.channel.findOneBy({
    channel: user
  })

  if (existing) return

  await db.channel.save({
    allowed: true,
    allowed_live: true,
    channel: user,
    connect_timestamp: Date.now(),
    joined: true,
    times_connected: 1
  })

  await client.join(user)
}
