import { RandomColorCommand } from "@src/commands/cmd/randomcolor"
import { setup } from "@test-utils/setup"

describe('random color', () => {
  let randomColor: RandomColorCommand

  beforeEach(() => {
    setup()
    randomColor = new RandomColorCommand()
  })

  it('return a random generated hexcode', async () => {
    const returnedCode = '#11111'

    spyOn(randomColor.methods, 'generateHex').and.returnValue(returnedCode)

    const { response, success } = await randomColor.execute()

    expect(response).toBe(`${returnedCode}`)
    expect(success).toBeTrue()
  })

  it('generate function returns a string with 7 chars', () => {
    const color = randomColor.methods.generateHex()

    expect(color).toBeDefined()
    expect(color.length).toBe(7)
  })
})