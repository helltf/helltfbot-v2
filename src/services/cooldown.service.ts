import { Command } from "../commands/types"

export class Cooldown {
  cooldowns: Map<string, string[]>

  constructor() {
    this.cooldowns = new Map<string, string[]>()
  }

  setCooldown({ name, cooldown }: Command, userId: string) {
    this.addCooldown(userId, name)

    setTimeout(() => {
      this.removeCooldown(userId, name)
    }, cooldown)
  }

  getCooldownsForUser(userId: string): string[] | undefined {
    return this.cooldowns.get(userId)
  }

  removeCooldown(userId: string, commandName: string) {
    const userCooldowns = this.getCooldownsForUser(userId)

    if (userCooldowns?.includes(commandName)) {
      this.cooldowns.set(
        userId,
        userCooldowns.filter(e => e !== commandName)
      )
    }
  }

  addCooldown(userId: string, commandName: string) {
    const userCooldowns = this.getCooldownsForUser(userId)

    if (!userCooldowns) {
      this.cooldowns.set(userId, [commandName])
    } else {
      userCooldowns.push(commandName)
    }
  }

  userHasCooldown({ name }: Command, userId: string): boolean | undefined {
    return this.getCooldownsForUser(userId)?.includes(name)
  }
}
