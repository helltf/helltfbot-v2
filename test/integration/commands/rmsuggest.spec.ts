import { ChatUserstate } from 'tmi.js'
import { RemoveSuggestCommand } from '../../../src/commands/cmd/rmsuggestion'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import { getExampleTwitchUserState } from '../../test-utils/example'
import { saveUserStateAsUser } from '../../test-utils/save-user'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test rmsuggest command', () => {
  let channel: string
  let user: ChatUserstate
  let rmsuggest: RemoveSuggestCommand
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    channel = 'channel'
    rmsuggest = new RemoveSuggestCommand()
    user = getExampleTwitchUserState({})
    await clearDb(hb.db.dataSource)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('required id is undefined return error message', async () => {
    const message = ['']

    const response = await rmsuggest.execute(channel, user, message)

    expect(response.success).toBeFalse()
    expect(response.response).toBe(
      'You need to specify an id to delete your suggestion'
    )
    expect(response.channel).toBe(channel)
  })

  it('id is not an number return error', async () => {
    const message = ['a']

    const response = await rmsuggest.execute(channel, user, message)

    expect(response.success).toBeFalse()
    expect(response.response).toBe('id has to be a number')
  })

  it('id is defined but not in database return error', async () => {
    const id = '1'
    const message = [id]

    const response = await rmsuggest.execute(channel, user, message)

    expect(response.success).toBeFalse()
    expect(response.response).toBe(
      `Id ${id} does not exist or the suggestion is created by somebody else`
    )
  })

  it('id is defined and existing in the database, delete the entry', async () => {
    await saveUserStateAsUser(user)

    const savedEntity = await hb.db.suggestionRepo.save({
      date: 1,
      user: {
        id: parseInt(user['user-id']!)
      },
      suggestion: 'a'
    })

    const id = savedEntity.id
    const message = [`${id}`]

    const response = await rmsuggest.execute(channel, user, message)

    const entity = await hb.db.suggestionRepo.findOneBy({
      id: id
    })

    expect(response.success).toBeTrue()
    expect(response.response).toBe(
      `Succesfully removed your suggestion with id ${id}`
    )
    expect(entity).toBeNull()
  })

  it('id is defined but user differs from db entry return fail', async () => {
    const id = '1'
    const message = [id]
    await saveUserStateAsUser(user)

    const savedEntity = await hb.db.suggestionRepo.save({
      date: 1,
      user: {
        id: parseInt(user['user-id']!)
      },
      suggestion: 'a'
    })

    user['user-id'] = '5'

    const response = await rmsuggest.execute(channel, user, message)

    const remainingEntity = await hb.db.suggestionRepo.findOneBy({
      id: savedEntity.id
    })

    expect(response.success).toBeFalse()
    expect(response.response).toBe(
      `Id ${id} does not exist or the suggestion is created by somebody else`
    )
    expect(remainingEntity).not.toBeNull()
  })
})
