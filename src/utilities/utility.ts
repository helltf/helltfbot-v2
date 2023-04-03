import { Resource, ResourceError, ResourceSuccess } from '@api/types'
import { CryptoUtility } from '@src/utilities/crypto'
import { exec } from 'child_process'
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from 'humanize-duration-ts'
import { promisify } from 'util'

const execute = promisify(exec)
const validChars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

export class Utility {
  crypto: CryptoUtility

  constructor() {
    this.crypto = new CryptoUtility()
  }

  random = (lowerLimit = 0, upperLimit = 1): number => {
    return Math.floor(Math.random() * (upperLimit + lowerLimit + 1))
  }

  async exec(command: string): Promise<Resource<string>> {
    try {
      const { stdout, stderr } = await execute(command)

      if (stderr) {
        return new ResourceError(stderr)
      }

      return new ResourceSuccess(stdout)
    } catch (e: any) {
      return new ResourceError('error')
    }
  }

  plularizeIf(input: string, someNumber: number) {
    return someNumber === 1 ? input : this.plularize(input)
  }

  humanize(time: number): string {
    const formatter = new HumanizeDuration(new HumanizeDurationLanguage())
    return this.shortenTimeString(formatter.humanize(time, { round: true }))
  }

  humanizeNow(time: number): string {
    const difference = Date.now() - time
    return this.humanize(difference)
  }

  plularize = (input: string): string => input + 's'

  shortenTimeString(timeString: string) {
    return timeString
      .replace(/years?/, 'y')
      .replace(/months?/, 'm')
      .replace(/weeks?/, 'w')
      .replace(/days?/, 'd')
      .replace(/hours?/, 'h')
      .replace(/minutes?/, 'min')
      .replace(/seconds?/, 's')
      .replace(/\s/g, '')
      .replace(/,/g, ' ')
  }
}
