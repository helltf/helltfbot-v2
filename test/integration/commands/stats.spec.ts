import {BotResponse} from "@src/client/types"
import { StatsCommand, StatsType } from "@src/commands/cmd/stats"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { saveUserStateAsUser } from '@test-utils/save-user'
import { setupDatabase } from '@test-utils/setup-db'
import { HelpCommmand } from '@commands/cmd/help'

describe('stats command', () => {
  let stats: StatsCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  beforeEach(async () => {
    stats = new StatsCommand()
    await clearDb(hb.db.dataSource)
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('type is not existing return error', async () => {
      const { response, success } = await stats.execute({
        channel,
        user,
        params: { type: 'abc' }
      })

      expect(response).toBe(`Valid stats are ${Object.values(StatsType)}`)
      expect(success).toBe(false)
    })

    it('type is command but no command given return error', async () => {
      const exampleResponse = {
        response: 'response',
        success: false
      }

      jest
        .spyOn(stats.methods, 'getCommandStats')
        .mockResolvedValue(exampleResponse)

      const { response, success } = await stats.execute({
        channel,
        user,
        params: {
          type: StatsType.COMMAND
        }
      })

      expect(response).toBe(exampleResponse.response)
      expect(success).toBe(exampleResponse.success)
      expect(stats.methods.getCommandStats).toHaveBeenCalled()
    })

    it('type is command invoke get command stats function', async () => {
      const statsType = StatsType.COMMAND
      const command = 'testcommand'
      const exampleResponse = {
        response: 'response',
        success: true
      }

      jest
        .spyOn(stats.methods, 'getCommandStats')
        .mockResolvedValue(exampleResponse)

      const response = await stats.execute({
        channel,
        params: { type: statsType, lookup: command },
        user
      })

      expect(response).toEqual(exampleResponse)
      expect(stats.methods.getCommandStats).toHaveBeenCalled()
    })

    it('user has no stats return error', async () => {
      const { response, success } = await stats.execute({
        channel,
        user,
        params: { type: StatsType.EMOTEGAME }
      })

      expect(response).toBe(`${user.username} has no stats recorded`)
      expect(success).toBe(false)
    })

    it('type is emotegame return stats for user', async () => {
      const letters = 1
      const emotes = 1
      const incorrect = 2

      await saveUserStateAsUser(user)
      await hb.db.emoteStats.save({
        user: {
          id: Number(user['user-id'])
        },
        emotes_guessed: emotes,
        letters_guessed: letters,
        incorrect_guesses: incorrect
      })

      const { response, success } = await stats.execute({
        channel,
        user,
        params: { type: StatsType.EMOTEGAME }
      })

      const expectedResponse = [
        `${user.username} guessed ${letters} letters`,
        `${emotes} emotes`,
        `${incorrect} times incorrect`,
        `Position: 1`
      ]

      expect(response).toEqual(expectedResponse)
      expect(success).toBe(true)
    })

    it('user is given as param has no stats return error', async () => {
      const lookupUser = 'lookup'

      const { response, success } = await stats.execute({
        channel,
        user,
        params: {
          type: StatsType.EMOTEGAME,
          lookup: lookupUser
        }
      })

      expect(response).toBe(`${lookupUser} has no stats recorded`)
      expect(success).toBe(false)
    })

    it('user is given as param has no stats but other user has return error', async () => {
      const lookupUser = 'lookup'
      const type = StatsType.EMOTEGAME

      await saveUserStateAsUser(user)
      await hb.db.emoteStats.save({
        user: {
          id: Number(user['user-id'])
        },
        emotes_guessed: 1,
        letters_guessed: 1,
        incorrect_guesses: 1
      })

      const { response, success } = await stats.execute({
        channel,
        user,
        params: { type, lookup: lookupUser }
      })

      expect(response).toBe(`${lookupUser} has no stats recorded`)
      expect(success).toBe(false)
    })

    it('user is given and has stats return stats', async () => {
      const lookupUser = getExampleTwitchUserEntity({ name: 'lookup' })
      const type = StatsType.EMOTEGAME
      const letters_guessed = 1
      const emotes_guessed = 1
      const incorrect_guesses = 2

      await hb.db.user.save(lookupUser)
      await hb.db.emoteStats.save({
        user: {
          id: lookupUser.id
        },
        emotes_guessed,
        incorrect_guesses,
        letters_guessed
      })

      const { response, success } = await stats.execute({
        channel,
        user,
        params: {
          type,
          lookup: lookupUser.name
        }
      })

      const expectedResponse = [
        `${lookupUser.name} guessed ${letters_guessed} letters`,
        `${emotes_guessed} emotes`,
        `${incorrect_guesses} times incorrect`,
        `Position: 1`
      ]

      expect(response).toEqual(expectedResponse)
      expect(success).toBe(true)
    })
  })

  describe('leaderboard position', () => {
    let userEntity = getExampleTwitchUserEntity({})

    beforeEach(async () => {
      userEntity = getExampleTwitchUserEntity({})
      await hb.db.user.save(userEntity)
    })

    it('one entry has position of 1', async () => {
      await hb.db.emoteStats.save({
        emotes_guessed: 1,
        incorrect_guesses: 2,
        letters_guessed: 2,
        user: userEntity
      })

      const position = await stats.methods.getLeaderboardPosition(
        userEntity.name
      )

      expect(position).toBe(1)
    })

    it('user is on second place return position 2', async () => {
      const guessedEmotes = 1
      const letters_guessed = 0
      const incorrect_guesses = 0
      const user2 = getExampleTwitchUserEntity({
        name: 'user2',
        id: 2
      })

      await hb.db.user.save(user2)

      await hb.db.emoteStats.save({
        emotes_guessed: 1,
        incorrect_guesses,
        letters_guessed,
        user: userEntity
      })

      await hb.db.emoteStats.save({
        user: user2,
        emotes_guessed: guessedEmotes + 1,
        letters_guessed,
        incorrect_guesses
      })
    })

    it('user is on second place return position 2', async () => {
      const guessedEmotes = 1
      const letters_guessed = 0
      const incorrect_guesses = 0

      const user2 = getExampleTwitchUserEntity({
        name: 'user2',
        id: 2
      })

      await hb.db.user.save(user2)

      await hb.db.emoteStats.save({
        emotes_guessed: 1,
        incorrect_guesses,
        letters_guessed,
        user: user2
      })

      await hb.db.emoteStats.save({
        user: userEntity,
        emotes_guessed: guessedEmotes + 1,
        letters_guessed,
        incorrect_guesses
      })
    })
  })

  describe('command stats method', () => {
    it('method is invoked execute help command and return response', async () => {
      const command = new HelpCommmand()
      const channel = 'testchannel'
      const user = getExampleTwitchUserState({})
      const exampleResponse: BotResponse = {
        response: 'response',
        success: true
      }

      jest.spyOn(command, 'execute').mockResolvedValue(exampleResponse)
      jest.spyOn(hb.commands, 'findCommand').mockReturnValue(command)

      const { response, success } = await stats.methods.getCommandStats(
        command.name,
        user,
        channel
      )

      expect(response).toBe(exampleResponse.response)
      expect(success).toBe(true)
    })
  })
})
