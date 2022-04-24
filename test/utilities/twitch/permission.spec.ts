import { Badges } from 'tmi.js'
import { getChatPermissions, returnCorrectPermissions } from '../../../utilities/twitch/permission.js'

describe('test mapping of permissions', () => {
	it('normal user has permissions of 5', () => {
		let badges: Badges = {}
		let result = getChatPermissions(badges)

		expect(result).toBe(5)
	})

	it('subscriber user has permissions of 4', () => {
		let badges: Badges = {
			subscriber: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(4)
	})

	it('founder user has permissions of 4', () => {
		let badges: Badges = {
			founder: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(4)
	})

	it('vip user has permissions of 3', () => {
		let badges: Badges = {
			vip: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(3)
	})

	it('moderator user has permissions of 2', () => {
		let badges: Badges = {
			moderator: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(2)
	})

	it('broadcaster user has permissions of 1', () => {
		let badges: Badges = {
			broadcaster: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(1)
	})

	it('broadcaster user has permissions of 1', () => {
		let badges: Badges = {
			moderator: '0',
			subscriber: '0',
			broadcaster: '0',
		}
		let result = getChatPermissions(badges)

		expect(result).toBe(1)
	})

})

describe('return correct permission', () => { 
    it('db perm is lower returning db perm', () => {
        let dbPerm = 0
        let chatPerm = 1

        let res = returnCorrectPermissions(dbPerm, chatPerm)

        expect(res).toBe(dbPerm)
    })

    it('db perm is heigher returning chat perm', () => {
        let dbPerm = 5
        let chatPerm = 1

        let res = returnCorrectPermissions(dbPerm, chatPerm)

        expect(res).toBe(chatPerm)
    })
    it('db perm is the same returning chat perm', () => {
        let dbPerm = 3
        let chatPerm = 3

        let res = returnCorrectPermissions(dbPerm, chatPerm)

        expect(res).toBe(chatPerm)
    })
 })