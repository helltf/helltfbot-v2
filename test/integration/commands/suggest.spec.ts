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
    const response = await suggest.execute({
      channel,
      user,
      params: { suggestion }
    })

    expect(response.success).toBe(false)
  })

  it('suggestion is defined and response is successful', async () => {
    const suggestion = 'add'
    const expectedMessage = `@${process.env.MAIN_USER} new suggestion by ${user.username}`
    await saveUserStateAsUser(user)

    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    await suggest.execute({ channel, user, params: { suggestion } })
    expect(hb.sendMessage).toHaveBeenCalledWith(
      process.env.MAIN_USER,
      expectedMessage
    )
  })

  it('suggestion is defined and response is successful', async () => {
    const suggestion = 'add'
    await saveUserStateAsUser(user)
    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    const response = await suggest.execute({
      channel,
      user,
      params: { suggestion }
    })

    expect(response.success).toBe(true)
  })

  it('one word suggestion is defined and saved into db', async () => {
    const suggestion = 'add'
    await saveUserStateAsUser(user)
    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    const response = await suggest.execute({
      channel,
      user,
      params: { suggestion }
    })

    const savedEntity = await hb.db.suggestion.find()
    const expectedLength = 1
    const id = 1
    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity).toHaveLength(expectedLength)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBe(true)
  })

  it('save multiple words suggestion return succesfull response', async () => {
    const suggestion = 'add this do this'
    const id = 1
    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    await saveUserStateAsUser(user)

    const response = await suggest.execute({
      channel,
      user,
      params: { suggestion }
    })

    const savedEntity = await hb.db.suggestion.findOneBy({
      id: id
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${id}`

    expect(savedEntity!.suggestion).toBe(suggestion)
    expect(response.response).toEqual(expectedMessage)
    expect(response.success).toBe(true)
  })

  it('save two suggestions returns id 2', async () => {
    const suggestion = 'add this do this'
    await saveUserStateAsUser(user)
    jest.spyOn(hb, 'sendMessage').mockImplementation(jest.fn())

    await hb.db.suggestion.save({
      date: 1,
      suggestion: 'a',
      user: {
        id: parseInt(user['user-id']!)
      },
      channel
    })

    const response = await suggest.execute({
      channel,
      user,
      params: { suggestion }
    })
    const expectedId = 2

    const savedEntity = await hb.db.suggestion.findOneBy({
      id: expectedId
    })

    const expectedMessage = `Succesfully saved your suggestion with id ${expectedId}`

    expect(response.success).toBe(true)
    expect(response.response).toBe(expectedMessage)
    expect(savedEntity!.suggestion).toBe(suggestion)
  })
})
