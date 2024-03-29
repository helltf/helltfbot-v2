import { UidCommand } from "@src/commands/cmd/uid"
import { getExampleTwitchUserState } from "@test-utils/example"
import { setup } from "@test-utils/setup"

describe('test uid command', () => {
  const uid = new UidCommand()
  const channel = 'channel'
  const user = getExampleTwitchUserState({})

  beforeAll(() => {
    setup()
  })

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
    jest.spyOn(hb.api.twitch, 'getUserIdByName').mockResolvedValue(id)

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
    jest.spyOn(hb.api.twitch, 'getUserIdByName').mockResolvedValue(id)

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
