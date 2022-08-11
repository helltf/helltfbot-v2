import { CryptoUtility } from "@src/utilities/crypto"
import { randomBytes } from "crypto"

describe('cryptoUtil utilities', () => {
  let cryptoUtil: CryptoUtility

  beforeEach(() => {
    cryptoUtil = new CryptoUtility('q3t6w9z$C&F)J@NcRfUjXnZr4u7x!A%D')
  })

  it('cryptoUtil encrypts file with key and decrypts to same result', () => {
    const exampleMessage = 'Hello World'
    const nonce = randomBytes(24)

    const encryptedMessage = cryptoUtil.closeBox(exampleMessage, nonce)
    const resultMessage = cryptoUtil.openBox(encryptedMessage, nonce)

    expect(exampleMessage).toBe(resultMessage)
  })
})