import { StatsCommand, StatsType } from "@src/commands/cmd/stats"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
import { getExampleTwitchUserEntity, getExampleTwitchUserState } from "@test-utils/example"
import { saveUserStateAsUser } from "@test-utils/save-user"
import { setupDatabase } from "@test-utils/setup-db"

describe('stats command', () => {
    let stats: StatsCommand
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

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

    it('type is not given return error', async () => {
        const message: string[] = []

        const { response, success } = await stats.execute({
            channel,
            user,
            message
        })

        expect(response).toBe(`Valid stats are ${Object.values(StatsType)}`)
        expect(success).toBeFalse()
    })

    it('type is not existing return error', async () => {
        const message = ['abc']

        const { response, success } = await stats.execute({
            channel,
            user,
            message
        })

        expect(response).toBe(`Valid stats are ${Object.values(StatsType)}`)
        expect(success).toBeFalse()
    })

    it('user has no stats return error', async () => {
        const message = [StatsType.EMOTEGAME]

        const { response, success } = await stats.execute({
            channel, user, message
        })

        expect(response).toBe(`${user.username} has no stats recorded`)
        expect(success).toBeFalse()
    })

    it('type is emotegame return stats for user', async () => {
        const message = [StatsType.EMOTEGAME]
        const letters = 1
        const emotes = 1
        const incorrect = 2

        await saveUserStateAsUser(user)
        await hb.db.emoteStatsRepo.save({
            user: {
                id: Number(user["user-id"])
            },
            emotes_guessed: emotes,
            letters_guessed: letters,
            incorrect_guesses: incorrect
        })

        const { response, success } = await stats.execute({
            channel, user, message
        })

        const expectedResponse = [
            `${user.username} guessed ${letters} letters`,
            `${emotes} emotes`,
            `${incorrect} times incorrect`
        ]

        expect(response).toEqual(expectedResponse)
        expect(success).toBeTrue()
    })

    it('user is given as param has no stats return error', async () => {
        const lookupUser = 'lookup'
        const message = [StatsType.EMOTEGAME, lookupUser]

        const { response, success } = await stats.execute({
            channel, user, message
        })

        expect(response).toBe(`${lookupUser} has no stats recorded`)
        expect(success).toBeFalse()
    })

    it('user is given as param has no stats but other user has return error', async () => {
        const lookupUser = 'lookup'
        const message = [StatsType.EMOTEGAME, lookupUser]

        await saveUserStateAsUser(user)
        await hb.db.emoteStatsRepo.save({
            user: {
                id: Number(user["user-id"])
            },
            emotes_guessed: 1,
            letters_guessed: 1,
            incorrect_guesses: 1
        })

        const { response, success } = await stats.execute({
            channel, user, message
        })

        expect(response).toBe(`${lookupUser} has no stats recorded`)
        expect(success).toBeFalse()
    })

    it('user is given and has stats return stats', async () => {
        const lookupUser = getExampleTwitchUserEntity({ name: 'lookup' })
        const message = [StatsType.EMOTEGAME, lookupUser.name]
        const letters_guessed = 1
        const emotes_guessed = 1
        const incorrect_guesses = 2

        await hb.db.userRepo.save(lookupUser)
        await hb.db.emoteStatsRepo.save({
            user: {
                id: lookupUser.id
            },
            emotes_guessed,
            incorrect_guesses,
            letters_guessed
        })

        const { response, success } = await stats.execute({
            channel, user, message
        })

        const expectedResponse = [
            `${lookupUser.name} guessed ${letters_guessed} letters`,
            `${emotes_guessed} emotes`,
            `${incorrect_guesses} times incorrect`
        ]

        expect(response).toEqual(expectedResponse)
        expect(success).toBeTrue()
    })
})