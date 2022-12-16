import { CoinflipCommand } from "@src/commands/cmd/coinflip"

describe('coinflip command', () => {
  let coinflip: CoinflipCommand

  describe('execute', () => {
    beforeEach(() => {
      coinflip = new CoinflipCommand()
    })

    it('result is heads return true result', async () => {
      jest.spyOn(coinflip.methods, 'flipCoin').mockReturnValue(true)

      const result = await coinflip.execute()

      expect(result.response).toBe('You flipped heads (yes)')
      expect(result.success).toBe(true)
    })

    it('result is tails return false result', async () => {
      jest.spyOn(coinflip.methods, 'flipCoin').mockReturnValue(false)

      const result = await coinflip.execute()

      expect(result.response).toBe('You flipped talis (no)')
      expect(result.success).toBe(true)
    })
  })
  describe('methods', () => {
    describe('flip coin', () => {
      it('random number is 1 return true', () => {
        const result = coinflip.methods.flipCoin()

        expect(result).toBe(true)
      })
    })
  })
})
