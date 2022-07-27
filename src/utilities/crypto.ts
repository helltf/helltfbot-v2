import'dotenv/config'
import { secretbox } from "tweetnacl"


export class CryptoUtility {
  key: Uint8Array
  private encoder = new TextEncoder()
  private decoder = new TextDecoder()

  constructor(key: string | undefined = process.env.ENCRYPT_KEY) {
    this.key = this.encoder.encode(key)
  }
  openBox(message: Uint8Array, nonce: Buffer): string {
    const token = secretbox.open(message, nonce, this.key)!
    return this.decoder.decode(token)
  }

  closeBox(message: string, nonce: Buffer): Uint8Array {
    return secretbox(this.encoder.encode(message), nonce, this.key)
  }
}