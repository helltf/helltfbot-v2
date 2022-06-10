import { Permission } from '@src/utilities/twitch/permission'

export class Utility {
  permission: Permission

  constructor() {
    this.permission = new Permission()
  }

  random = (lowerLimit = 0, upperLimit = 1): number => {
    return Math.floor(Math.random() * (upperLimit + lowerLimit + 1))
  }
}
