import { Permission } from '@src/utilities/permission/permission'
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts'
export class Utility {
  permission: Permission

  constructor() {
    this.permission = new Permission()
  }

  random = (lowerLimit = 0, upperLimit = 1): number => {
    return Math.floor(Math.random() * (upperLimit + lowerLimit + 1))
  }

  generateAllCombinations(arr1: any[], arr2: any[]): any[][] {
    return arr1.flatMap(d => arr2.map(v => [d, v]))
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
