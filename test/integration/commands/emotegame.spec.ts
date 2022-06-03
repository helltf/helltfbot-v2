import { TwitchUserState } from "../../../src/client/types.js"
import { EmotegameCommand } from "../../../src/commands/cmd/emotegame.js"
import { clearDb } from "../../test-utils/clear.js"
import { disconnectDatabase } from "../../test-utils/disconnect.js"
import { getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from "../../test-utils/setup-db.js"

describe('test emotegame', () => {
  let user: TwitchUserState
  let messageChannel: string
  let emotegame: EmotegameCommand
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    user = getExampleTwitchUserState({})
    messageChannel = 'messageChannel'
    emotegame = new EmotegameCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })
})
  
