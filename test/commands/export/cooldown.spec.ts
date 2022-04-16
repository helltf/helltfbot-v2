import { ChatUserstate } from 'tmi.js'
import { Command } from '../../../commands/export/command.js'
import { Cooldown } from '../../../commands/export/cooldown.js'
import { exampleCommand } from '../../../spec/support/exmples/command.js'
import { exampleUser } from '../../../spec/support/exmples/user.js'

describe('testing cooldown class', () => {
	let cooldown: Cooldown
	let command: Command
	let user: ChatUserstate

	beforeEach(() => {
		cooldown = new Cooldown()
		command = exampleCommand
		user = exampleUser
	})

	it('setting cooldown add entry in map', () => {
		cooldown.setCooldown(exampleCommand, user['user-id'])
	})
})
