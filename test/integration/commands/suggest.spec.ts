import { TwitchUserState } from '../../../src/client/types.js'
import { suggest } from '../../../src/commands/cmd/suggest.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleTwitchUserState } from '../../test-utils/example.js'
import { saveUserStateAsUser } from '../../test-utils/save-user.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('test suggest command', () => {
  let channel: string
  let user: TwitchUserState = getExampleTwitchUserState({})

  beforeAll(async () => {
    channel = 'channel'
    user = getExampleTwitchUserState({})
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb(hb.db.dataSource)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('suggestion is undefined return error', async () => {
    const suggestion = ''
    const response = await suggest.execute(channel, user, [suggestion])

    expect(response.success).toBeFalse()
  })

  it('suggestion is defined and response is successful', async () => {
    const message = ['add']
    await saveUserStateAsUser(user)

    const response = await suggest.execute(channel, user, message)

    expect(response.success).toBeTrue()
  })

  it('one word suggestion is defined and saved into db', async () => {
    const message = ['add']
    await saveUserStateAsUser(user)

    const response = await suggest.execute(channel, user, message)

    const savedEntity = await hb.db.suggestionRepo.find()
    const expectedLength = 1
    const id = 1
    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity).toHaveSize(expectedLength)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBeTrue()
  })

  it('save multiple words suggestion return succesfull response', async () => {
    const message = ['add', 'this', 'do', 'this']
    const id = 1

    await saveUserStateAsUser(user)

    const response = await suggest.execute(channel, user, message)

    const savedEntity = await hb.db.suggestionRepo.findOneBy({
      id: id
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity!.suggestion).toBe(`${message.join(' ')}`)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBeTrue()
  })

  it('save two suggestions returns id 2', async () => {
    const message = ['add', 'this', 'do', 'this']
    await saveUserStateAsUser(user)

    await hb.db.suggestionRepo.save({
      date: 1,
      suggestion: 'a',
      user: {
        id: parseInt(user['user-id']!)
      }
    })

    const response = await suggest.execute(channel, user, message)
    const expectedId = 2

    const savedEntity = await hb.db.suggestionRepo.findOneBy({
      id: expectedId
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${expectedId}`
    const expectedSavedSuggestion = `${message.join(' ')}`

    expect(response.success).toBeTrue()
    expect(response.response).toBe(expectedMessage)
    expect(savedEntity!.suggestion).toBe(expectedSavedSuggestion)
  })
})
