import { Permission } from '@src/utilities/permission/permission'

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
}
