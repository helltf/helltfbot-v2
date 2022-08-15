import { CryptoUtility } from '@src/utilities/crypto'
import { Permission } from '@src/utilities/permission/permission'
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from 'humanize-duration-ts'
export class Utility {
  permission: Permission
  crypto: CryptoUtility

  constructor() {
    this.permission = new Permission()
    this.crypto = new CryptoUtility()
  }

  random = (lowerLimit = 0, upperLimit = 1): number => {
    return Math.floor(Math.random() * (upperLimit + lowerLimit + 1))
  }

  generateAllCombinations<T, U>(arr1: T[], arr2: U[]): (T | U)[][] {
    return arr1.flatMap(val1 => arr2.map(val2 => [val1, val2]))
  }

  plularizeIf(input: string, someNumber: number) {
    return someNumber === 1 ? input + 's' : input
  }

  getEnumValues(anyEnum: any): any[] {
    return Object.keys(anyEnum)
      .filter(v => !isNaN(Number(v)))
      .map(v => Number(v))
  }

  enumContains(anyEnum: any, value: string) {
    return Object.values(anyEnum).indexOf(value) !== -1
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
