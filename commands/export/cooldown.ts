import { Command } from "./command"

export class Cooldown{
	cooldowns: Map<string, string[]>

	constructor() {
		this.cooldowns = new Map<string, string[]>()
	}

	setCooldown(command: Command, userId: string){
        let cooldowns = this.getCooldownsForUser(userId)
        cooldowns.push("fsjdlkfsjfdl")
		setTimeout(()=> {

			if(cooldowns.includes(command.name)){
				this.cooldowns.delete
			}

		}, command.cooldown)
	}

	getCooldownsForUser(userId: string): string[]{
		return this.cooldowns.get(userId)
	}
}
