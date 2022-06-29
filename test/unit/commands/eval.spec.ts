import { EvalCommand } from "@src/commands/cmd/eval"
import { getExampleTwitchUserState } from "@test-utils/example"

describe('eval command', () => {
    let evalcommand: EvalCommand
    const user = getExampleTwitchUserState({})
    beforeEach(() => {
        evalcommand = new EvalCommand()
    })

    it('code throws error return error', async () => {
        const error = 'error'
        const code = `throw new Error('${error}')`

        const { response, success } = await evalcommand.execute({
            channel: 'channel',
            message: [code],
            user: user
        })

        expect(success).toBeFalse()
        expect(response).toBeDefined()
    })

    it('code throws no error return success', async () => {
        const returnValue = 'abc'
        const code = `return '${returnValue}'`

        const { response, success } = await evalcommand.execute({
            channel: 'channel',
            message: [code],
            user: user
        })

        expect(success).toBeTrue()
        expect(response).toBe(returnValue)
    })

    it('code returns object stringify object', async () => {
        const returnValue = JSON.stringify({
            a: 1,
            b: "asd"
        })

        const code = `return '${returnValue}'`

        const { response, success } = await evalcommand.execute({
            channel: 'channel',
            message: [code],
            user: user
        })

        expect(success).toBeTrue()
        expect(response).toBe(returnValue)
    })
})