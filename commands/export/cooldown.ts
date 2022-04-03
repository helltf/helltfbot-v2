import { Command } from './command'

export class Cooldown {
	cooldowns: Map<string, string[]>

	constructor() {
		this.cooldowns = new Map<string, string[]>()
	}

	setCooldown({ name, cooldown }: Command, userId: string) {
		this.#addCooldown(userId, name)

		setTimeout(() => {
			this.#removeCooldown(userId, name)
		}, cooldown)
	}

	getCooldownsForUser(userId: string): string[] {
		return this.cooldowns.get(userId)
	}

	#removeCooldown(userId: string, commandName: string) {
		let userCooldowns = this.getCooldownsForUser(userId)

		if (userCooldowns.includes(commandName)) {
			this.cooldowns.set(
				userId,
				userCooldowns.filter((e) => e !== commandName)
			)
		}
	}

	#addCooldown(userId: string, comamndName: string) {
		let userCooldowns = this.getCooldownsForUser(userId)

		if (!userCooldowns) {
			this.cooldowns.set(userId, [comamndName])
		} else {
			userCooldowns.push(comamndName)
		}
	}

	userHasCooldown({ name }: Command, userId: string): boolean {
		return this.getCooldownsForUser(userId).includes(name)
	}
}
