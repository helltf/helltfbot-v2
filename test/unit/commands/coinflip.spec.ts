import { CoinflipCommand } from "@src/commands/cmd/coinflip"
import { setup } from "@test-utils/setup"

describe('coinflip command', () => {
  let coinflip: CoinflipCommand

  beforeEach(() => {
    coinflip = new CoinflipCommand()
    setup()
  })

  describe('execute', () => {
    it('result is heads return true result', async () => {
      jest.spyOn(coinflip.methods, 'flipCoin').mockReturnValue(true)

      const result = await coinflip.execute()

      expect(result.response).toBe('You flipped heads (yes)')
      expect(result.success).toBe(true)
    })

    it('result is tails return false result', async () => {
      jest.spyOn(coinflip.methods, 'flipCoin').mockReturnValue(false)

      const result = await coinflip.execute()

      expect(result.response).toBe('You flipped tails (no)')
      expect(result.success).toBe(true)
    })
  })

  describe('methods', () => {
    describe('flip coin', () => {
      it('random number is 1 return true', () => {
        jest.spyOn(hb.utils, 'random').mockReturnValue(1)
        console.log(coinflip.methods.flipCoin())

        const result = coinflip.methods.flipCoin()

        expect(result).toBe(true)
      })

      it('random number is 0 return false', () => {
        jest.spyOn(hb.utils, 'random').mockReturnValue(0)

        const result = coinflip.methods.flipCoin()

        expect(result).toBe(false)
      })
    })
  })
})
