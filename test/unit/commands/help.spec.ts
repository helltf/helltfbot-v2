import { HelpCommmand } from "@src/commands/cmd/help"
import { getExampleTwitchUserState } from "@test-utils/example"
import { setup } from "@test-utils/setup"
import exp from "constants"

fdescribe('help command', () => {
    let help: HelpCommmand
    const channel = ''
    const user = getExampleTwitchUserState({})

    beforeEach(() => {
        help = new HelpCommmand()
        setup()
    })

    it('no command given return error', async () => {
        const { response, success } = await help.execute({
            channel: channel,
            message: [],
            user
        })
        const expectedResponse = [
            'Bot created by @helltf',
            'All commands are listed here (coming soon)'
        ]

        expect(success).toBeTrue()
        expect(response).toEqual(expectedResponse)
    })

    it('command does not exist return error', async () => {
        const message = ['unknown command']

        const { response, success } = await help.execute({
            channel,
            message,
            user
        })

        expect(success).toBeFalse()
        expect(response).toBe('This command does not exist')
    })

    it('command does exist return information', async () => {
        const command = help
        const message = [command.name]

        const { response, success } = await help.execute({
            channel,
            message,
            user
        })

        const expectedResponse = [
            `Name: ${command.name}`,
            `Aliases: ${command.alias.join(',')}`,
            `Description: ${command.description}`,
            `Cooldown: ${command.cooldown / 1000}s`,
            `Permissions: ${hb.utils.permission.map(command.permissions)}`,
            `Required params: ${command.requiredParams.join(',')}`,
            `Optional params: ${command.optionalParams.join(',')}`
        ]

        expect(success).toBeTrue()
        expect(response).toEqual(expectedResponse)
    })
})