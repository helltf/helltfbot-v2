import { StatsCommand, StatsType } from "@src/commands/cmd/stats"

describe('stats command', () => {
  let stats: StatsCommand
  const validTypes = Object.values(StatsType)

  beforeEach(() => {
    stats = new StatsCommand()
  })

  describe('isvalid function', () => {
    validTypes.forEach(type => {
      it(`${type} is valid return true`, () => {
        const result = stats.methods.isValidType(type)

        expect(result).toBeTrue()
      })
    })

    it('type is incorrect return false', () => {
      const type = 'sfds'
      const result = stats.methods.isValidType(type)

      expect(result).toBeFalse()
    })
  })
})