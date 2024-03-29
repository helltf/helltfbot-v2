import { ChatUserstate } from 'tmi.js'
import { RemoveSuggestCommand } from '@commands/cmd/rmsuggestion'
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
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('id is not an number return error', async () => {
    const response = await rmsuggest.execute({
      channel,
      user,
      params: { id: 'a' }
    })

    expect(response.success).toBe(false)
    expect(response.response).toBe('id has to be a number')
  })

  it('id is defined but not in database return error', async () => {
    const id = '1'

    const response = await rmsuggest.execute({ channel, user, params: { id } })

    expect(response.success).toBe(false)
    expect(response.response).toBe(
      `Id ${id} does not exist or the suggestion is created by somebody else`
    )
  })

  it('id is defined and existing in the database, delete the entry', async () => {
    await saveUserStateAsUser(user)

    const savedEntity = await hb.db.suggestion.save({
      date: 1,
      user: {
        id: parseInt(user['user-id']!)
      },
      suggestion: 'a',
      channel
    })

    const id = savedEntity.id

    const response = await rmsuggest.execute({
      channel,
      user,
      params: { id: `${id}` }
    })

    const entity = await hb.db.suggestion.findOneBy({
      id: id
    })

    expect(response.success).toBe(true)
    expect(response.response).toBe(
      `Succesfully removed your suggestion with id ${id}`
    )
    expect(entity).toBeNull()
  })

  it('id is defined but user differs from db entry return fail', async () => {
    const id = '1'
    await saveUserStateAsUser(user)

    const savedEntity = await hb.db.suggestion.save({
      date: 1,
      user: {
        id: parseInt(user['user-id']!)
      },
      suggestion: 'a',
      channel
    })

    user['user-id'] = '5'

    const response = await rmsuggest.execute({ channel, user, params: { id } })

    const remainingEntity = await hb.db.suggestion.findOneBy({
      id: savedEntity.id
    })

    expect(response.success).toBe(false)
    expect(response.response).toBe(
      `Id ${id} does not exist or the suggestion is created by somebody else`
    )
    expect(remainingEntity).not.toBeNull()
  })
})
