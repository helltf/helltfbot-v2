import { TwitchUserState } from '@client/types'
import { SuggestCommand } from '@commands/cmd/suggest'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import { getExampleTwitchUserState } from '../../test-utils/example'
import { saveUserStateAsUser } from '../../test-utils/save-user'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test suggest command', () => {
  let channel: string
  let user: TwitchUserState = getExampleTwitchUserState({})
  let suggest: SuggestCommand

  beforeAll(async () => {
    channel = 'channel'
    suggest = new SuggestCommand()
    user = getExampleTwitchUserState({})
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('suggestion is undefined return error', async () => {
    const suggestion = ''
    const message = [suggestion]
    const response = await suggest.execute({ channel, user, message })

    expect(response.success).toBe(false)
  })

  it('suggestion is defined and response is successful', async () => {
    const message = ['add']
    const expectedMessage = `@${process.env.MAIN_USER} new suggestion by ${user.username}`
    await saveUserStateAsUser(user)

    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    await suggest.execute({ channel, user, message })
    expect(hb.sendMessage).toHaveBeenCalledWith(process.env.MAIN_USER, expectedMessage)
  })

  it('suggestion is defined and response is successful', async () => {
    const message = ['add']
    await saveUserStateAsUser(user)

    const response = await suggest.execute({ channel, user, message })

    expect(response.success).toBe(true)
  })

  it('one word suggestion is defined and saved into db', async () => {
    const message = ['add']
    await saveUserStateAsUser(user)

    const response = await suggest.execute({ channel, user, message })

    const savedEntity = await hb.db.suggestion.find()
    const expectedLength = 1
    const id = 1
    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity).toHaveLength(expectedLength)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBe(true)
  })

  it('save multiple words suggestion return succesfull response', async () => {
    const message = ['add', 'this', 'do', 'this']
    const id = 1

    await saveUserStateAsUser(user)

    const response = await suggest.execute({ channel, user, message })

    const savedEntity = await hb.db.suggestion.findOneBy({
      id: id
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity!.suggestion).toBe(`${message.join(' ')}`)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBe(true)
  })

  it('save two suggestions returns id 2', async () => {
    const message = ['add', 'this', 'do', 'this']
    await saveUserStateAsUser(user)

    await hb.db.suggestion.save({
      date: 1,
      suggestion: 'a',
      user: {
        id: parseInt(user['user-id']!)
      }
    })

    const response = await suggest.execute({ channel, user, message })
    const expectedId = 2

    const savedEntity = await hb.db.suggestion.findOneBy({
      id: expectedId
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${expectedId}`
    const expectedSavedSuggestion = `${message.join(' ')}`

    expect(response.success).toBe(true)
    expect(response.response).toBe(expectedMessage)
    expect(savedEntity!.suggestion).toBe(expectedSavedSuggestion)
  })
})
