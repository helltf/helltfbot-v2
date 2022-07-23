import { BinaryLike, CipherKey, createCipheriv, createDecipheriv, randomBytes } from "crypto"

const algorithm = 'aes-256-cbc'

export class CryptoUtility {
  key: CipherKey
  iv: BinaryLike
  constructor(key: string = process.env.ENCRYPT_KEY) {
    this.key = key
  }
  encrypt(message: string, iv: BinaryLike): string {
    const cipher = createCipheriv(algorithm, this.key, iv)
    return cipher.update(message, 'utf-8', 'hex') + cipher.final('hex')
  }

  decrypt(message: string, iv: BinaryLike): string {
    const decipher = createDecipheriv(algorithm, this.key, iv)

    return decipher.update(message, 'hex', 'utf-8') + decipher.final('utf8')
  }
}