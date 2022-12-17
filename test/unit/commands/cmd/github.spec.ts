import { GithubCommand } from '@src/commands/cmd/github'

describe('github command', () => {
  let github: GithubCommand

  beforeEach(() => {
    github = new GithubCommand()
  })

  describe('execute', () => {
    it('returns website', async () => {
      const { response, success } = await github.execute()

      expect(response).toBe(
        'FeelsOkayMan Feel free to leave a follow at https://github.com/helltf and visit the github page for my bot https://github.com/helltf/helltfbot-v2'
      )
      expect(success).toBe(true)
    })
  })
})
