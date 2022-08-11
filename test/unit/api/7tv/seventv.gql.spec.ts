import { SevenTvGQL } from '@api/7tv/seventv.gql'
import { ResourceError } from '@api/types'

fdescribe('7tv gql', () => {
  let gql: SevenTvGQL

  beforeEach(() => {
    gql = new SevenTvGQL()
  })

  describe('get error', () => {
    const codeResponses = [
      ['70403', 'Please add me as an editor of your channel :)'],
      ['704611', 'Emote is already enabled'],
      ['704610', 'Emote is not enabled'],
      ['704612', 'Emote with this name already exists'],
      ['704620', 'No slot available'],
      ['0', 'Unknown Error']
    ]

    codeResponses.forEach(([code, message]) => {
      it(`Error code ${code} returns ${message}`, () => {
        const errorMessage = gql.getErrorMessage(code)

        expect(errorMessage).toEqual(new ResourceError(message))
      })
    })
  })
})
