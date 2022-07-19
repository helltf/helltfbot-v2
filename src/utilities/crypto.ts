import { BinaryLike, CipherKey, createCipheriv, createDecipheriv, randomBytes } from "crypto"

export class CryptoUtility {
    key: CipherKey
    iv: BinaryLike
    constructor(key: string = process.env.ENCRYPT_KEY) {
        this.key = randomBytes(32);
        this.iv = Buffer.alloc(8, 0);
    }
    encrypt(message: string, iv: BinaryLike): string {
        const cipher = createCipheriv('aes-256-gcm', this.key, this.iv)

        return cipher.update(message, 'utf-8', 'hex') + cipher.final('hex')
    }

    decrypt(message: string, iv: BinaryLike): string {
        const decipher = createDecipheriv('aes-256-gcm', this.key, this.iv)

        return decipher.update(message, 'utf-8', 'hex') + decipher.final('hex')
    }
}