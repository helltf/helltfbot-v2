import { CryptoUtility } from "@src/utilities/crypto"
import { randomBytes } from "crypto"

fdescribe('cryptoUtil utilities', () => {
    let cryptoUtil: CryptoUtility

    beforeEach(() => {
        cryptoUtil = new CryptoUtility()
    })

    it('cryptoUtil encrypts file with key and decrypts to same result', () => {
        const exampleMessage = 'Hello World'
        const iv = 'sadasd'

        const encryptedMessage = cryptoUtil.encrypt(exampleMessage, iv)
        console.log(encryptedMessage)
        const resultMessage = cryptoUtil.decrypt(encryptedMessage, iv)

        expect(exampleMessage).toBe(resultMessage)
    })
})