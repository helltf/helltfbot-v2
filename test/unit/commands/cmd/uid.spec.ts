import { UidCommand } from "@src/commands/cmd/uid"
import { createTestDeps } from "@test-utils/deps"
import { getExampleTwitchUserState } from "@test-utils/example"

describe('test uid command', () => {
  const deps = createTestDeps()
  const uid = new UidCommand(deps)
  const channel = 'channel'
  const user = getExampleTwitchUserState({})

  it('no user is given return usernames id', async () => {
    const id = user['user-id']!

    const { response, success } = await uid.execute({
      channel,
      user,
      params: {}
    })

    expect(response).toBe(`${user.username}👉${id}`)
    expect(success).toBe(true)
  })

  it('user is given return user id from api', async () => {
    const searchedUser = 'searchedUser'
    const id = 300
    jest.spyOn(deps.api.twitch, 'getUserIdByName').mockResolvedValue(id)

    const { response, success } = await uid.execute({
      channel,
      user,
      params: {
        user: searchedUser
      }
    })

    expect(response).toBe(`${searchedUser}👉${id}`)
    expect(success).toBe(true)
  })

  it("user can't be found return error response", async () => {
    const searchedUser = 'searchedUser'
    const id = undefined
    jest.spyOn(deps.api.twitch, 'getUserIdByName').mockResolvedValue(id)

    const { response, success } = await uid.execute({
      channel,
      user,
      params: {
        user: searchedUser
      }
    })

    expect(response).toBe(`Could not find user`)
    expect(success).toBe(false)
  })
})
